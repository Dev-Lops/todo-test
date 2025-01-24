"use client";

import { useAuth } from "@/contexts/AuthContext"; // Contexto de autenticação
import { useRouter } from "next/router";
import Link from "next/link";

export default function HomePage() {
  const { user, isAuthenticated, signOut } = useAuth(); // Autenticação do contexto
  const router = useRouter();

  // Função de logout com redirecionamento
  const handleLogout = async () => {
    try {
      signOut();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="w-[500px] h-screen bg-gray-100 flex flex-col items-center justify-between m-auto ">
      {/* Cabeçalho */}
      <header className="w-full max-w-5xl mx-auto flex flex-col items-center justify-between p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold text-teal-600">Minha Aplicação</h1>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Olá, {user?.name || "Usuário"}!
            </span>
            <button
              onClick={handleLogout}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link href="/signIn">
            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
              Entrar
            </button>
          </Link>
        )}
      </header>

      {/* Conteúdo principal */}
      <main className="flex w-full max-w-5xl mx-auto mt-6">
        {isAuthenticated ? (
          <div className="bg-white p-6 rounded-lg shadow-md justify-center items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Bem-vindo, {user?.name || "Usuário"}!
            </h2>
            <p className="text-gray-600 mt-2">
              Explore as funcionalidades da aplicação usando os links abaixo:
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/dashboard">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                  Ir para o Dashboard
                </button>
              </Link>
              <Link href="/tasks">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                  Gerenciar Tarefas
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">
              Bem-vindo à aplicação!
            </h2>
            <p className="text-gray-600 mt-2">
              Por favor, entre ou cadastre-se para acessar todas as
              funcionalidades.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/signIn">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                  Entrar
                </button>
              </Link>
              <Link href="/signUp">
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                  Cadastrar
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Rodapé */}
      <footer className="w-full max-w-5xl mx-auto mt-6 p-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Todo. Todos os direitos reservados.
      </footer>
    </div>
  );
}
