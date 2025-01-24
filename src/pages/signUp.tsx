"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { Form } from "../components/ui/Form/Form";
import { FormField } from "../components/ui/Form/FormField";
import { Button } from "../components/ui/Button/Button";
import { Toast } from "../components/ui/Toast/Toast";
import Head from "next/head";
import Link from "next/link";
import { signUpSchema, type SignUpData } from "@/schemas/auth/signUpSchema";
import { api } from "@/lib/api";

export default function SignUp() {
  const { signUp } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  // Função para verificar se o email já existe
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/auth/check-email", { email });
      return response.data.exists; // Retorna true se existir
    } catch {
      return false; // Considera que o email não existe se houver erro
    }
  };

  const handleSubmit = async (data: SignUpData) => {
    try {
      // Verifica se o email já está em uso
      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        setToast({
          message: "Este email já está em uso. Por favor, tente outro.",
          type: "error",
        });
        return;
      }

      // Realiza o cadastro
      await signUp(data);
      setToast({ message: "Conta criada com sucesso!", type: "success" });
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || "Erro ao criar conta.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Cadastro | App</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-teal-600">
            Criar Conta
          </h1>
          <Form form={form} onSubmit={handleSubmit}>
            <FormField
              name="name"
              label="Nome"
              placeholder="Digite seu nome"
              error={form.formState.errors.name?.message} // Mostra o erro de validação
            />
            <FormField
              name="email"
              label="Email"
              placeholder="Digite seu email"
              error={form.formState.errors.email?.message}
            />
            <FormField
              name="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
              error={form.formState.errors.password?.message}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.watch("email")}
              className="w-full mt-5"
            >
              {form.formState.isSubmitting ? "Criando conta..." : "Cadastrar"}
            </Button>
          </Form>
          <div className="mt-4 text-center">
            <Link href="/signIn" className="text-teal-600 hover:underline">
              Já tem uma conta? Entre
            </Link>
          </div>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
