import RegisterForm from "./RegisterForm";
import "../assets/assets.css";
import "./register.css";

// Registration page. Reached via the QR code; not linked from any navigation.
export const metadata = {
  title: "Register | Candeur",
  description: "Register your details with Candeur and our team will connect with you shortly.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="client-assets register">
      <header className="client-assets__bar">
        <div className="delta-container">
          <a className="client-assets__logo" href="/" aria-label="Candeur home">
            <img src="/images/logo.png" alt="Candeur" width={175} height={44} />
          </a>
        </div>
      </header>

      <main className="client-assets__body">
        <div className="delta-container">
          <RegisterForm />
        </div>
      </main>

      <footer className="client-assets__footer">
        <div className="delta-container">
          <span>© 2026 Candeur</span>
        </div>
      </footer>
    </div>
  );
}
