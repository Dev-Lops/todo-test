import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  UNEXPECTED_ERROR: "An unexpected error occurred",
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Busca o usuário pelo e-mail
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Verifica se o usuário existe e valida a senha
          const isPasswordValid =
            user && (await bcrypt.compare(credentials.password, user.password));

          if (!isPasswordValid) {
            throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
          }

          // Retorna os dados do usuário
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          throw new Error(ERROR_MESSAGES.UNEXPECTED_ERROR);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Página de login personalizada
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
