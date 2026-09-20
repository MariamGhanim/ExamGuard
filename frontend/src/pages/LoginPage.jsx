import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthCredentialsForm from "../components/AuthCredentialsForm";
import { register, signIn } from "../api/auth";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");

  async function handleSubmit(credentials) {
    if (mode === "register") {
      // Mock: pretends a verification email was sent. See api/auth.js.
      await register(credentials);
      navigate("/verify-code", {
        state: { email: credentials.email, nationalId: credentials.nationalId },
      });
      return;
    }

    // Mock: sign-in skips OTP and goes straight to home. See api/auth.js.
    await signIn(credentials);
    navigate("/home", { replace: true });
  }

  return (
    <AuthLayout
      titleId="login-heading"
      subtitle={mode === "register" ? "Create a proctor account" : "Proctor sign-in"}
      footnote="Authorized exam staff only"
    >
      <div className="auth-tabs" role="tablist" aria-label="Account options">
        <button
          type="button"
          role="tab"
          id="tab-signin"
          aria-selected={mode === "signin"}
          className={`auth-tabs__tab${mode === "signin" ? " is-active" : ""}`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          id="tab-register"
          aria-selected={mode === "register"}
          className={`auth-tabs__tab${mode === "register" ? " is-active" : ""}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <div key={mode} className="auth-tabs__panel" role="tabpanel">
        <AuthCredentialsForm mode={mode} onSubmit={handleSubmit} />
      </div>
    </AuthLayout>
  );
}