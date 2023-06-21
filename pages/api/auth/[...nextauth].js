import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import Auth0Provider from 'next-auth/providers/auth0';
import { signIn } from "next-auth/react";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_AUTH_ID,
        clientSecret: process.env.GOOGLE_AUTH_SECRET,
       }),
       GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),Auth0Provider({
        id: "dex-provider",
        name: "DEX",
        type: "oauth",
        wellKnown: "http://dex:5556/dex/.well-known/openid-configuration",
        clientId: process.env.DEX_ID,
        clientSecret: process.env.DEX_SECRET,
        authorization: { params: { scope: "openid email profile" } },
        idToken: true,
        profile(profile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: null,
          }
        },
      })
  ],
  pages: {
    signIn: "/auth/login"
  },
}
export default NextAuth(authOptions)