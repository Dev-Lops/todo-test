import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const PUBLIC_ROUTES = ["/signIn", "/signUp"];

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated &&
      !PUBLIC_ROUTES.includes(router.pathname)
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
