import crypto from "crypto";

// Prefix makes keys easy to identify (e.g. in logs or secret scanners).
const KEY_PREFIX = "rt";

// Number of random bytes before encoding. 32 bytes = 256 bits of entropy,
// which is plenty to make brute-forcing infeasible.
const KEY_BYTES = 32;

/**
 * Hash a plaintext API key for storage.
 *
 * We store only the hash (never the plaintext). SHA-256 is appropriate here
 * because API keys are high-entropy random values — unlike user passwords,
 * they are not guessable, so a slow password hash (bcrypt/argon2) isn't needed.
 *
 * @param {string} key - The plaintext API key.
 * @returns {string} Hex-encoded SHA-256 hash.
 */
export const hashApiKey = (key) =>
  crypto.createHash("sha256").update(key).digest("hex");

/**
 * Generate a new random API key.
 *
 * Returns both the plaintext key and its hash:
 *  - `key`      → return this to the client ONCE; it cannot be recovered later.
 *  - `apiHashed`→ persist this in the ApiKey model's `apiHashed` field.
 *
 * The plaintext is URL-safe (base64url) and prefixed for easy identification.
 *
 * @returns {{ key: string, apiHashed: string }}
 */
const generateApiKey = () => {
  const random = crypto.randomBytes(KEY_BYTES).toString("base64url");
  const key = `${KEY_PREFIX}_${random}`;

  return {
    key,
    apiHashed: hashApiKey(key),
  };
};

export default generateApiKey;
