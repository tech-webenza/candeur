import { DownloadSimple, File, FilePdf } from "@phosphor-icons/react/dist/ssr";

const ASSETS_BASE = "/candeur/client-assets";

const IMAGE_TYPES = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg"]);
const VIDEO_TYPES = new Set(["mp4", "webm", "mov", "m4v"]);

function extension(file) {
  return file.includes(".") ? file.split(".").pop().toLowerCase() : "";
}

// The title shown is the file name itself, without its extension.
function title(file) {
  return file.replace(/\.[^.]+$/, "");
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ClientAssets({ folder, files }) {
  const base = `${ASSETS_BASE}/${folder}/`;

  return (
    <div className="client-assets">
      <header className="client-assets__bar">
        <div className="delta-container">
          <a className="client-assets__logo" href="/" aria-label="Candeur home">
            <img src="/candeur/images/logo.png" alt="Candeur" width={175} height={44} />
          </a>
        </div>
      </header>

      <main className="client-assets__body">
        <div className="delta-container">
          <h1 className="visually-hidden">Candeur downloads</h1>
          <ul className="client-assets__grid">
            {files.map(({ file, size }) => (
              <AssetCard key={file} file={file} href={base + encodeURIComponent(file)} size={size} />
            ))}
          </ul>
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

function AssetCard({ file, href, size }) {
  const ext = extension(file);
  const name = title(file);
  const meta = [ext.toUpperCase(), formatSize(size)].filter(Boolean).join(" · ");

  let preview;
  if (IMAGE_TYPES.has(ext)) {
    preview = <img src={href} alt={name} loading="lazy" decoding="async" />;
  } else if (VIDEO_TYPES.has(ext)) {
    // "#t=0.1" makes mobile browsers show the first frame instead of a blank box.
    preview = <video src={`${href}#t=0.1`} controls playsInline preload="metadata" aria-label={name} />;
  } else {
    const Icon = ext === "pdf" ? FilePdf : File;
    preview = (
      <span className="client-assets__doc" aria-hidden="true">
        <Icon size={64} weight="light" />
        {ext !== "pdf" && <span>{ext.toUpperCase() || "FILE"}</span>}
      </span>
    );
  }

  return (
    <li className="client-assets__card">
      <div className="client-assets__preview">{preview}</div>
      <div className="client-assets__info">
        <span className="client-assets__text">
          <span className="client-assets__name">{name}</span>
          {/* <span className="client-assets__meta">{meta}</span> */}
        </span>
        <a
          className="client-assets__download"
          href={href}
          download={file}
          aria-label={`Download ${name} (${meta})`}
          rel="noreferrer"
        >
          <DownloadSimple size={24} weight="regular" aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}
