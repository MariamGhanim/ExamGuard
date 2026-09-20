import { Link } from "react-router-dom";
import "./PlaceholderPage.css";

export default function HelpPage() {
  return (
    <main className="placeholder-page">
      <div className="placeholder-page__panel">
        <h1>Need help signing in?</h1>
        <p>
          Contact your system administrator if you&apos;re having trouble accessing
          your account.
        </p>
        <Link to="/login">Back to sign in</Link>
      </div>
    </main>
  );
}
