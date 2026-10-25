import "dotenv/config";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  baseUrl: requiredEnv("BASE_URL"),
  apiUrl: requiredEnv("API_URL"),
  standardUser: requiredEnv("STANDARD_USER"),
  standardPassword: requiredEnv("STANDARD_PASSWORD"),
  lockedOutUser: requiredEnv("LOCKED_OUT_USER"),
  lockedOutPassword: requiredEnv("LOCKED_OUT_PASSWORD"),
};