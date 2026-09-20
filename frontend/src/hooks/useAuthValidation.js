export const NATIONAL_ID_LENGTH = 14;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function digitsOnly(value) {
  return value.replace(/\D/g, "");
}

export function validateAuthFields({ nationalId, email }) {
  const errors = {};
  const id = digitsOnly(nationalId);
  const trimmedEmail = email.trim();

  if (!id) {
    errors.nationalId = "National ID is required.";
  } else if (id.length !== NATIONAL_ID_LENGTH) {
    errors.nationalId = `National ID must be ${NATIONAL_ID_LENGTH} digits.`;
  }

  if (!trimmedEmail) {
    errors.email = "College email is required.";
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter a valid college email address.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateOtpCode(code) {
  const digits = digitsOnly(code);
  if (digits.length !== 6) {
    return "Enter the 6-digit verification code.";
  }
  return "";
}

/**
 * Field-level validation used for inline errors (on blur / submit).
 * Kept separate from submit handlers so form components stay presentational.
 */
export function useAuthValidation() {
  return {
    validateAuthFields,
    validateOtpCode,
    nationalIdLength: NATIONAL_ID_LENGTH,
    digitsOnly,
  };
}
