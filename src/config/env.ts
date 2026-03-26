/*
JWT_SECRET_KEY=veryscretkey
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET_KEY=veryscretrefreshkey
JWT_REFRESH_EXPIRES_IN=7d
*/

interface IEnvReturnType {
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_SECRET_KEY: string;
  JWT_REFRESH_EXPIRES_IN: string;
  FRONTEND_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URI?: string;
  GOOGLE_FRONTEND_URL?: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

const envConfig = (): IEnvReturnType => {
  const envName = [
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "JWT_SECRET_KEY",
    "JWT_EXPIRES_IN",
    "JWT_REFRESH_SECRET_KEY",
    "JWT_REFRESH_EXPIRES_IN",
    "FRONTEND_URL",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "GOOGLE_FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",

    // FRONTEND_URL is optional.
  ];

  envName.forEach((element) => {
    if (!process.env[element]) {
      throw new Error(`Missing environment variable: ${element}`);
    }
  });

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error(
      "Missing Cloudinary environment variables. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    );
  }

  return {
    PORT: process.env.PORT!,
    DATABASE_URL: process.env.DATABASE_URL!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY!,
    FRONTEND_URL: process.env.FRONTEND_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    GOOGLE_FRONTEND_URL: process.env.GOOGLE_FRONTEND_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  };
};

export const envVeriables = envConfig();
