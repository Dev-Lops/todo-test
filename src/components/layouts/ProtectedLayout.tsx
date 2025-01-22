import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../ui/Header/Header';
import { Sidebar } from '../ui/Sidebar/Sidebar';
import { LoadingSpinner } from '../ui/LoadingSpinner/LoadingSpinner';

interface ProtectedLayoutProps {
  children: ReactNode;
}

// Lista de rotas públicas
const PUBLIC_ROUTES = ['/signin', '/signup'];

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(router.pathname)) {
      router.replace('/signin'); // Redireciona para a página de login
    }
  }, [isAuthenticated, isLoading, router]);

  // Enquanto verifica a autenticação, mostra o spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Para rotas públicas, renderiza o conteúdo diretamente
  if (PUBLIC_ROUTES.includes(router.pathname)) {
    return <>{children}</>;
  }

  // Para rotas protegidas, renderiza o layout principal
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
