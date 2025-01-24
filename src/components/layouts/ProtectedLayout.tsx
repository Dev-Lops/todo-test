"use client";

import React, { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Header } from "@/components/ui/Header/Header";
import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redireciona para a página de login caso o usuário não esteja autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/signIn");
    }
  }, [isLoading, isAuthenticated, router]);

  // Exibe um spinner enquanto a autenticação é verificada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Aguarda o redirecionamento ser processado antes de renderizar o layout principal
  if (!isAuthenticated) {
    return null;
  }

  // Renderiza o layout principal
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
