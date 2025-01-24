import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/signIn"); // Redireciona para /signIn se não autenticado
      }
    }, [isAuthenticated, isLoading, router]);

    // Enquanto verifica o estado de autenticação, pode exibir um carregando
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          Carregando...
        </div>
      );
    }

    // Renderiza o componente protegido se o usuário estiver autenticado
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
