import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request) {
  try {
    if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
      console.error(
        "Salesforce Error: SALESFORCE_CLIENT_ID or SALESFORCE_CLIENT_SECRET environment variable is not defined."
      );
      return NextResponse.json(
        { success: false, message: "Server configuration error: missing credentials." },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const { name, phone, priceRange, email } = await request.json();

    // 1. Generate Salesforce access token
    const tokenResponse = await fetch(
      "https://power-connect-1333.my.salesforce.com/services/oauth2/token",
      {
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
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Salesforce token generation failed:", tokenData);

      return NextResponse.json(
        { success: false, message: "Authentication failed." },
        {
          status: 502,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 2. Create lead using the access token
    const leadPayload = {
      FirstName: name.trim(),
      LastName: name.trim(),
      Phone: phone,
      Email: email || "",
      BudgetRange: priceRange,
      campaign: "Summer Campaign",
      medium: "cpc",
      term: "",
      subSource: "Google_Search",
      source: "Google",
      project: "Novo Gardenia",
      channel: "Webenza",
      firstEnquirySource: "Google",
      whatsAppNumber: phone,
    };

    const leadResponse = await fetch(
      "https://power-connect-1333.my.salesforce.com/services/apexrest/LPLeads",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
        cache: "no-store",
      }
    );

    const leadData = await leadResponse.json();

    if (!leadResponse.ok || leadData.success !== true) {
      console.error("Salesforce lead creation failed:", leadData);

      return NextResponse.json(
        {
          success: false,
          message: "Unable to submit your enquiry. Please try again.",
        },
        {
          status: 502,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
      },
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (error) {
    console.error("Salesforce integration error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}