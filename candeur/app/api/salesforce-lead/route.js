
import { NextResponse } from "next/server";

// Candeur Production Salesforce API
const TOKEN_URL =
  "https://power-connect-1333.my.salesforce.com/services/oauth2/token";

const LEAD_PATH = "/services/apexrest/LPLeads";

const CORS = {
  "Access-Control-Allow-Origin": "*",
};

// Accepted attribution keys
const ATTRIBUTION_KEYS = [
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmTerm",
  "utmContent",
  "gclid",
];

// Reuse Salesforce token until 401
let cachedToken = null;

function text(value, maxLength = 255) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      FirstName: "",
      LastName: parts[0].slice(0, 80),
    };
  }

  return {
    FirstName: parts[0].slice(0, 40),
    LastName: parts.slice(1).join(" ").slice(0, 80),
  };
}

// OPTIONS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Generate Salesforce token
async function getToken(forceRefresh = false) {
  if (cachedToken && !forceRefresh) {
    return cachedToken;
  }

  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SALESFORCE_CLIENT_ID,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET,
    }),
    cache: "no-store",
  });

  const tokenData = await tokenResponse.json().catch(() => ({}));

  if (!tokenResponse.ok || !tokenData.access_token) {
    cachedToken = null;

    console.error("Salesforce token generation failed:", tokenData);

    return null;
  }

  cachedToken = {
    accessToken: tokenData.access_token,
    instanceUrl: (
      tokenData.instance_url ||
      new URL(TOKEN_URL).origin
    ).replace(/\/$/, ""),
  };

  return cachedToken;
}

// Create lead in Salesforce
async function postLead(token, leadPayload) {
  const response = await fetch(
    `${token.instanceUrl}${LEAD_PATH}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadPayload),
      cache: "no-store",
    }
  );

  const leadData = await response.json().catch(() => ({}));

  return {
    status: response.status,
    ok: response.ok,
    leadData,
  };
}

// POST
export async function POST(request) {
  try {
    if (
      !process.env.SALESFORCE_CLIENT_ID ||
      !process.env.SALESFORCE_CLIENT_SECRET
    ) {
      console.error("Salesforce credentials are missing.");

      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error.",
        },
        { status: 500, headers: CORS }
      );
    }

    const body = await request.json().catch(() => ({}));

    const name = text(body.name, 120);
    const phone = text(body.phone, 40);

    if (!name || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter your name and mobile number.",
        },
        { status: 400, headers: CORS }
      );
    }

    // Get UTM and GCLID from frontend request body
    const attribution = {};

    for (const key of ATTRIBUTION_KEYS) {
      attribution[key] = text(body[key]);
    }

    // Salesforce lead payload
    const leadPayload = {
      ...splitName(name),

      Phone: phone,
      Email: text(body.email, 80),
      BudgetRange: text(body.priceRange),

      // Existing campaign details
      campaign: "Summer Campaign",
      medium: "cpc",
      term: "",

      subSource: "Google_Search",
      source: "Google",
      project: "Novo Gardenia",
      channel: "Webenza",
      firstEnquirySource: "Google",

      whatsAppNo: phone,

      // UTM + GCLID
      ...attribution,
    };

    console.log("Candeur Lead Payload:", leadPayload);

    let token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Salesforce authentication failed.",
        },
        { status: 502, headers: CORS }
      );
    }

    let result = await postLead(token, leadPayload);

    // Refresh token and retry once on 401
    if (result.status === 401) {
      token = await getToken(true);

      if (token) {
        result = await postLead(token, leadPayload);
      }
    }

    if (!result.ok || result.leadData.success !== true) {
      console.error(
        "Salesforce lead creation failed:",
        result.status,
        result.leadData
      );

      return NextResponse.json(
        {
          success: false,
          message: "Unable to submit your enquiry. Please try again.",
        },
        { status: 502, headers: CORS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
        leadId: result.leadData.leadId || null,
      },
      { status: 201, headers: CORS }
    );

  } catch (error) {
    console.error("Salesforce integration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500, headers: CORS }
    );
  }
}
