import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env variable: ${key}`);
  return val;
}

export const env = {
  PORT: parseInt(getEnv("PORT")),
  MONGODB_URI: getEnv("MONGODB_URI").replace(
    "<db_password>",
    getEnv("DB_PASSWORD")
  ),
  JWT_SECRET: getEnv("JWT_SECRET"),
  EMAIL_USER: getEnv("EMAIL_USER"),
  EMAIL_PASSWORD: getEnv("EMAIL_PASSWORD"),
};
