import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { db, mongoClient } from "./mongo";

const appUrl = (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");

export const auth = betterAuth({
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  user: {
    // optional banner on the profile page, empty means the default one
    additionalFields: {
      coverImage: { type: "string", required: false, input: true },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: appUrl,
        audience: appUrl,
        expirationTime: "1h",
        // the express api only needs who the user is
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }),
      },
    }),
    nextCookies(),
  ],
});
