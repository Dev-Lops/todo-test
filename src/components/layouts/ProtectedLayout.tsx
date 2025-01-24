"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Header } from "@/components/ui/Header/Header";
import { Sidebar } from "@/components/ui/Sidebar/Sidebar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth(); // Usando contexto de autenticação
  const router = useRouter();

  // Exibe um spinner de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Redireciona para o login se o usuário não estiver autenticado
  if (!isAuthenticated) {
    router.replace("/");
    return null; // Evita renderizar enquanto redireciona
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
