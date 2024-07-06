import * as dotenv from "dotenv";
import { ENVIRONMENT } from "./environment";

dotenv.config();

export const config = Object.freeze({
  app: {
    port: parseInt(process.env.PORT!),
    bases: {
      pl: {
        baseUrl: process.env.PL_BASE_URL as string,
        clientId: process.env.PL_CLIENT_ID as string,
        secret: process.env.PL_SECRET as string,
      },
      si: {
        baseUrl: process.env.SI_BASE_URL as string,
        clientId: process.env.SI_CLIENT_ID as string,
        secret: process.env.SI_SECRET as string,
      },
    },
    environment: {
      mode: process.env.NODE_ENV,
      isInProduction: process.env.NODE_ENV === ENVIRONMENT.PROD,
      isInDevelopment: process.env.NODE_ENV === ENVIRONMENT.DEV,
      isInTesting: process.env.NODE_ENV === ENVIRONMENT.TEST,
    },
    blacklist: {
      ID: process.env.BLACKLIST_ID as string,
    },
  },
  mail: {
    elastic: {
      apiKey: process.env.ELASTIC_MAIL_API_KEY as string,
    },
    nodemailer: {
      service: "gmail",
      auth: process.env.APP_USER as string,
      pass: process.env.APP_PASS as string,
    },
    globalFrom: process.env.MAIL_FROM as string,
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    smtpUsername: process.env.USER_EMAIL,
    smtpClientId: process.env.CLIENT_ID as string,
    smtpClientSecret: process.env.CLIENT_SECRET as string,
    smtpRefreshToken: process.env.REFRESH_TOKEN as string,
  },
  auth: {
    verification: {
      key: process.env.VERIFICATION_KEY as string,
      base: process.env.VERIFICATION_BASE as string,
      appId: process.env.VERIFICATION_APP_ID as string,
    },
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_SECRET_LIFE_SPAN as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    refreshTokenExpiresIn: process.env.ACCESS_TOKEN_SECRET_LIFE_SPAN as string,
    resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_SECRET as string,
    resetPasswordTokenExpiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_LIFE_SPAN as string,
    BankToken: process.env.PAYMENT_SECRET_KEY as string,
  },
  cache: {
    port: parseInt(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST,
    ttl: parseInt(process.env.REDIS_TTL!),
  },
  db: {
    mongodb: {
      MONGO_URL: process.env.MONGODB_URL as string,
    },
    postgresql: {
      POSTGRESQL_USER: process.env.POSTGRESQL_USER as string,
      POSTGRESQL_USER_PASSWORD: process.env.POSTGRESQL_USER_PASSWORD as string,
      POSTGRESQL_DATABASE: process.env.POSTGRESQL_DATABASE as string,
      POSTGRESQL_PORT: parseInt(process.env.POSTGRESQL_PORT!),
    },
  },
  baseLink: process.env.BASE_URL as string,
  rateLimit: {
    limit: process.env.WINDOW_RATE_LIMIT,
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL as string,
    username: process.env.SUPER_ADMIN_USERNAME as string,
    password: process.env.SUPER_ADMIN_PASSWORD as string
  },
  keys: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
  },
});

export enum Roles {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export default config;