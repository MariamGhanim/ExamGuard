import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthValidation } from "../hooks/useAuthValidation";
import "./LoginForm.css";

export default function AuthCredentialsForm({ mode, onSubmit }) {
  const {
    validateAuthFields,
    digitsOnly,
    nationalIdLength,
  } = useAuthValidation();

  const [nationalId, setNationalId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  const submitLabel = isRegister
    ? "Create account"
    : "Sign in";

  const pendingLabel = isRegister
    ? "Sending code…"
    : "Signing in…";

  function clearFieldError(name) {
    setFieldErrors((current) => {
      if (!current[name]) return current;

      const next = { ...current };
      delete next[name];

      return next;
    });
  }

  function handleBlur(name, value) {
    if (name === "password") {
      if (!value) {
        setFieldErrors((current) => ({
          ...current,
          password: "Password is required",
        }));
      }

      return;
    }

    const { errors } = validateAuthFields({
      nationalId:
        name === "nationalId"
          ? value
          : nationalId,

      email:
        name === "email"
          ? value
          : email,
    });

    setFieldErrors((current) => ({
      ...current,
      ...(errors[name]
        ? { [name]: errors[name] }
        : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

    const { isValid, errors } =
      validateAuthFields({
        nationalId,
        email,
      });

    let finalErrors = { ...errors };
    let formIsValid = true;

    if (isRegister) {
      formIsValid = isValid;
    } else {
      delete finalErrors.nationalId;

      if (!email || finalErrors.email) {
        formIsValid = false;
      }

      if (!password) {
        finalErrors.password =
          "Password is required";

        formIsValid = false;
      }
    }

    setFieldErrors(finalErrors);

    if (!formIsValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        email: email.trim(),

        ...(isRegister
          ? {
              nationalId:
                digitsOnly(nationalId),
            }
          : {
              password,
              rememberMe,
            }),
      });
    } catch (error) {
      setFormError(
        error.message ||
          "Invalid email or password"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isSubmitting}
    >
      {formError ? (
        <p
          className="login-form__banner"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      {/* ================= REGISTER ================= */}

      {isRegister && (
        <div className="login-form__field">
          <label
            className="login-form__label"
            htmlFor="auth-national-id"
          >
            National ID
          </label>

          <input
            id="auth-national-id"
            name="nationalId"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={nationalIdLength}
            placeholder={`${nationalIdLength} digits`}
            value={nationalId}
            disabled={isSubmitting}
            aria-invalid={Boolean(
              fieldErrors.nationalId
            )}
            aria-describedby={
              fieldErrors.nationalId
                ? "auth-national-id-error"
                : undefined
            }
            className={`login-form__input${
              fieldErrors.nationalId
                ? " is-invalid"
                : ""
            }`}
            onChange={(event) => {
              setNationalId(
                digitsOnly(
                  event.target.value
                ).slice(
                  0,
                  nationalIdLength
                )
              );

              clearFieldError(
                "nationalId"
              );
            }}
            onBlur={(event) =>
              handleBlur(
                "nationalId",
                event.target.value
              )
            }
          />

          {fieldErrors.nationalId ? (
            <p
              id="auth-national-id-error"
              className="login-form__error"
            >
              {fieldErrors.nationalId}
            </p>
          ) : null}
        </div>
      )}

      {/* ================= EMAIL ================= */}

      <div className="login-form__field">
        <label
          className="login-form__label"
          htmlFor="auth-email"
        >
          College email
        </label>

        <input
          id="auth-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck="false"
          value={email}
          disabled={isSubmitting}
          aria-invalid={Boolean(
            fieldErrors.email
          )}
          aria-describedby={
            fieldErrors.email
              ? "auth-email-error"
              : undefined
          }
          className={`login-form__input${
            fieldErrors.email
              ? " is-invalid"
              : ""
          }`}
          onChange={(event) => {
            setEmail(event.target.value);

            clearFieldError("email");
          }}
          onBlur={(event) =>
            handleBlur(
              "email",
              event.target.value
            )
          }
        />

        {fieldErrors.email ? (
          <p
            id="auth-email-error"
            className="login-form__error"
          >
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      {/* ================= PASSWORD ================= */}

      {!isRegister && (
        <div className="login-form__field">
          <label
            className="login-form__label"
            htmlFor="auth-password"
          >
            Password
          </label>

          <input
            id="auth-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={isSubmitting}
            aria-invalid={Boolean(
              fieldErrors.password
            )}
            aria-describedby={
              fieldErrors.password
                ? "auth-password-error"
                : undefined
            }
            className={`login-form__input${
              fieldErrors.password
                ? " is-invalid"
                : ""
            }`}
            onChange={(event) => {
              setPassword(
                event.target.value
              );

              clearFieldError(
                "password"
              );
            }}
            onBlur={(event) =>
              handleBlur(
                "password",
                event.target.value
              )
            }
          />

          {fieldErrors.password ? (
            <p
              id="auth-password-error"
              className="login-form__error"
            >
              {fieldErrors.password}
            </p>
          ) : null}
        </div>
      )}

      {/* ================= REMEMBER ME ================= */}

      {!isRegister && (
        <div
          className="login-form__row"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              disabled={isSubmitting}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked
                )
              }
            />

            <span>Remember Me</span>
          </label>

          <Link
            className="login-form__forgot"
            to="/help"
          >
            Forget Password
          </Link>
        </div>
      )}

      {/* ================= SUBMIT ================= */}

      <button
        className="login-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span
              className="login-form__spinner"
              aria-hidden="true"
            />

            {pendingLabel}
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
