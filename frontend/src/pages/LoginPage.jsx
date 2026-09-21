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
    try {
      if (mode === "register") {
        await register(credentials);

        navigate("/verify-code", {
          state: {
            email: credentials.email,
            nationalId: credentials.nationalId,
          },
        });

        return;
      }

      const result = await signIn(credentials);

      if (result.token) {
        if (credentials.rememberMe) {
          localStorage.setItem("token", result.token);
        } else {
          sessionStorage.setItem("token", result.token);
        }
      }

      navigate("/home", { replace: true });

    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  }

  return (
    <AuthLayout
      titleId="login-heading"
      subtitle={
        mode === "register"
          ? "Create a proctor account"
          : "Proctor sign-in"
      }
      footnote="Authorized exam staff only"
    >
      <div
        className="auth-tabs"
        role="tablist"
        aria-label="Account options"
      >
        <button
          type="button"
          role="tab"
          id="tab-signin"
          aria-selected={mode === "signin"}
          className={`auth-tabs__tab${
            mode === "signin" ? " is-active" : ""
          }`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>

        <button
          type="button"
          role="tab"
          id="tab-register"
          aria-selected={mode === "register"}
          className={`auth-tabs__tab${
            mode === "register" ? " is-active" : ""
          }`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <div
        key={mode}
        className="auth-tabs__panel"
        role="tabpanel"
      >
        <AuthCredentialsForm
          mode={mode}
          onSubmit={handleSubmit}
        />
      </div>
    </AuthLayout>
  );
}