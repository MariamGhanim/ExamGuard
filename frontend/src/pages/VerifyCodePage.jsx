import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resendCode, verifyCode } from "../api/auth";
import { useAuthValidation } from "../hooks/useAuthValidation";
import "../components/LoginForm.css";
import "./VerifyCodePage.css";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { validateOtpCode, digitsOnly } = useAuthValidation();

  const [digits, setDigits] = useState(() => Array(OTP_LENGTH).fill(""));
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  const code = digits.join("");

  function focusIndex(index) {
    inputRefs.current[index]?.focus();
  }

  function updateDigits(next) {
    setDigits(next);
    setFormError("");
  }

  function handleChange(index, value) {
    const nextDigit = digitsOnly(value).slice(-1);
    const next = [...digits];
    next[index] = nextDigit;
    updateDigits(next);
    if (nextDigit && index < OTP_LENGTH - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      updateDigits(next);
      focusIndex(index - 1);
    }
  }

  function handlePaste(event) {
    event.preventDefault();
    const pasted = digitsOnly(event.clipboardData.getData("text")).slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });
    updateDigits(next);
    focusIndex(Math.min(pasted.length, OTP_LENGTH - 1));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const error = validateOtpCode(code);
    if (error) {
      setFormError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock: any 6-digit code is accepted. See api/auth.js.
      await verifyCode({ email, code });
      navigate("/home", { replace: true });
    } catch (err) {
      setFormError(err.message || "Invalid or expired code");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || isResending) return;
    setFormError("");
    setIsResending(true);
    try {
      // Mock: pretends a new code was emailed. See api/auth.js.
      await resendCode({ email });
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusIndex(0);
    } catch (err) {
      setFormError(err.message || "Unable to resend the code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <AuthLayout titleId="verify-heading" subtitle="Verify your email">
      <form
        className="login-form"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
      >
        <p className="verify-code__message">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {formError ? (
          <p className="login-form__banner" role="alert">
            {formError}
          </p>
        ) : null}

        <fieldset className="verify-code__fieldset">
          <legend className="visually-hidden">6-digit verification code</legend>
          <div className="verify-code__digits" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                className={`verify-code__digit${formError ? " is-invalid" : ""}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                disabled={isSubmitting}
                aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
            ))}
          </div>
        </fieldset>

        <button className="login-form__submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="login-form__spinner" aria-hidden="true" />
              Verifying…
            </>
          ) : (
            "Verify"
          )}
        </button>

        <div className="verify-code__actions">
          <button
            type="button"
            className="verify-code__resend"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
          >
            {isResending
              ? "Sending…"
              : cooldown > 0
                ? `Resend code in ${cooldown}s`
                : "Resend code"}
          </button>
          <Link className="login-form__forgot" to="/login">
            Back
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
