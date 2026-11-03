"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DownloadSimple,
  File,
  FileImage,
  FilePdf,
  FileZip,
  LockSimple,
  WarningCircle,
} from "@phosphor-icons/react";

// Files live in public/client-assets/<key>/ next to a manifest.json listing them.
// The key travels only in the URL fragment (/assets#<key>), so it is never sent to the
// server, never appears in this bundle, and the folder can't be found without the QR code.
const ASSETS_DIR = "client-assets";
const KEY_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

const FILE_TYPES = {
  pdf: { label: "PDF", Icon: FilePdf },
  jpg: { label: "JPG", Icon: FileImage },
  jpeg: { label: "JPG", Icon: FileImage },
  png: { label: "PNG", Icon: FileImage },
  webp: { label: "WEBP", Icon: FileImage },
  svg: { label: "SVG", Icon: FileImage },
  zip: { label: "ZIP", Icon: FileZip },
};

function readKey() {
  const hash = window.location.hash.replace(/^#/, "");
  const key = new URLSearchParams(hash).get("k") ?? hash;
  return KEY_PATTERN.test(key) ? key : null;
}

// Supports a configured basePath or subdirectory deployment: /assets, /assets.html, /sub/assets/.
function siteBase() {
  return window.location.pathname.replace(/\/assets(\.html)?\/?$/, "");
}

function fileType(file) {
  const ext = file.split(".").pop().toLowerCase();
  return FILE_TYPES[ext] ?? { label: ext.toUpperCase(), Icon: File };
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// HEAD request: confirms the file exists and reads its size without downloading it.
async function probe(url) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (!res.ok) return { available: false };
    return { available: true, size: Number(res.headers.get("content-length")) };
  } catch {
    return { available: false, networkError: true };
  }
}

export default function ClientAssets() {
  // status: loading | locked | invalid | error | ready
  const [status, setStatus] = useState("loading");
  const [manifest, setManifest] = useState(null);
  const [baseUrl, setBaseUrl] = useState("");
  const [fileInfo, setFileInfo] = useState({});

  const load = useCallback(async () => {
    const key = readKey();
    if (!key) {
      setStatus("locked");
      return;
    }
    setStatus("loading");
    const base = `${siteBase()}/${ASSETS_DIR}/${key}/`;
    try {
      const res = await fetch(`${base}manifest.json`, { cache: "no-store" });
      if (!res.ok) {
        setStatus(res.status === 404 ? "invalid" : "error");
        return;
      }
      const data = await res.json();
      setBaseUrl(base);
      setManifest(data);
      setFileInfo({});
      setStatus("ready");
      const files = data.groups.flatMap((group) => group.items.map((item) => item.file));
      files.forEach(async (file) => {
        const info = await probe(base + encodeURIComponent(file));
        setFileInfo((prev) => ({ ...prev, [file]: info }));
      });
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, [load]);

  return (
    <div className="client-assets">
      <header className="client-assets__hero">
        <div className="delta-container">
          <a className="client-assets__logo" href="/candeur/" aria-label="Candeur home">
            <img src="/candeur/images/logo.png" alt="Candeur" width={175} height={44} />
          </a>
          <p className="client-assets__eyebrow">Client downloads</p>
          <h1>{manifest?.title ?? "Your Candeur downloads"}</h1>
          {manifest?.description && <p className="client-assets__intro">{manifest.description}</p>}
        </div>
      </header>

      <main className="client-assets__body">
        <div className="delta-container">
          {status === "loading" && (
            <p className="client-assets__notice" role="status">
              Loading your files…
            </p>
          )}

          {status === "locked" && (
            <Notice Icon={LockSimple} title="Scan your QR code to continue">
              This page opens from the QR code shared with you by your Candeur representative. Please
              scan it again to see your files.
            </Notice>
          )}

          {status === "invalid" && (
            <Notice Icon={WarningCircle} title="This link is no longer active">
              The QR code you scanned has expired or is incorrect. Please contact your Candeur
              representative for an updated one.
            </Notice>
          )}

          {status === "error" && (
            <Notice Icon={WarningCircle} title="We couldn't load your files">
              Please check your connection and try again.
              <button type="button" className="client-assets__retry cta" onClick={load}>
                Try again
              </button>
            </Notice>
          )}

          {status === "ready" &&
            manifest.groups.map((group) => (
              <section className="client-assets__group" key={group.title} aria-labelledby={slug(group.title)}>
                <h2 id={slug(group.title)}>{group.title}</h2>
                <ul className="client-assets__list">
                  {group.items.map((item) => (
                    <AssetRow
                      key={item.file}
                      item={item}
                      href={baseUrl + encodeURIComponent(item.file)}
                      info={fileInfo[item.file]}
                    />
                  ))}
                </ul>
              </section>
            ))}
        </div>
      </main>

      <footer className="client-assets__footer">
        <div className="delta-container">
          <span>© 2026 Candeur</span>
          <span>Shared privately. Please do not forward this link.</span>
        </div>
      </footer>
    </div>
  );
}

function AssetRow({ item, href, info }) {
  const { label, Icon } = fileType(item.file);
  const checking = !info;
  const unavailable = info && !info.available;
  const size = formatSize(info?.size);

  let meta = [label, size].filter(Boolean).join(" · ");
  if (unavailable) {
    meta = info.networkError ? "Couldn't reach this file. Please try again." : "Currently unavailable";
  }

  return (
    <li className={`client-assets__item${unavailable ? " is-unavailable" : ""}`}>
      <span className="client-assets__icon" aria-hidden="true">
        <Icon size={28} weight="light" />
      </span>
      <span className="client-assets__text">
        <span className="client-assets__name">{item.name}</span>
        <span className="client-assets__meta">{meta}</span>
      </span>
      {unavailable ? (
        <span
          className="client-assets__download is-disabled"
          role="img"
          aria-label={`${item.name} is currently unavailable`}
        >
          <WarningCircle size={24} weight="regular" aria-hidden="true" />
        </span>
      ) : (
        <a
          className="client-assets__download"
          href={href}
          download={item.downloadName ?? item.file}
          aria-label={`Download ${item.name}${checking ? "" : ` (${meta})`}`}
          rel="noreferrer"
        >
          <DownloadSimple size={24} weight="regular" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}

function Notice({ Icon, title, children }) {
  return (
    <div className="client-assets__notice client-assets__notice--panel" role="status">
      <Icon size={32} weight="light" aria-hidden="true" />
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function slug(text) {
  return `assets-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
