/**
 * Frontend-only auth helpers.
 *
 * Every function below is a MOCK: it waits briefly and then succeeds.
 * No real OTP is generated or sent. Replace the function bodies with
 * fetch() calls when the backend is ready (see per-function comments).
 */

const MOCK_DELAY_MS = 800;

function wait(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * PLACEHOLDER — replace with a real API call, for example:
 *   POST /api/auth/signin
 *   body: { nationalId, email }
 *   200:  { user }
 *   404:  { message: "National ID not found" }
 */
export async function signIn({ nationalId, email }) {
  await wait();
  return { nationalId, email };
}

/**
 * PLACEHOLDER — replace with a real API call that emails a verification code:
 *   POST /api/auth/register
 *   body: { nationalId, email }
 *   200:  { email }
 *   409:  { message: "Account already exists" }
 */
export async function register({ nationalId, email }) {
  await wait();
  return { nationalId, email };
}

/**
 * PLACEHOLDER — replace with a real API call, for example:
 *   POST /api/auth/verify-code
 *   body: { email, code }
 *   200:  { verified: true }
 *   400:  { message: "Invalid or expired code" }
 */
export async function verifyCode({ email, code }) {
  await wait();
  return { email, verified: true };
}

/**
 * PLACEHOLDER — replace with a real API call that resends the email code:
 *   POST /api/auth/resend-code
 *   body: { email }
 *   200:  { email }
 */
export async function resendCode({ email }) {
  await wait();
  return { email };
}
