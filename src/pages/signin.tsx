"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { Form } from "../components/ui/Form/Form";
import { FormField } from "../components/ui/Form/FormField";
import { Button } from "../components/ui/Button/Button";
import { Toast } from "../components/ui/Toast/Toast";
import Head from "next/head";
import Link from "next/link";
import { signInSchema, type SignInData } from "@/schemas/auth/signInSchema";

export default function SignIn() {
  const { signIn } = useAuth();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = async (data: SignInData) => {
    try {
      await signIn(data);
      setToast({ message: "Login bem-sucedido!", type: "success" });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Erro ao fazer login",
        type: "error",
      });
      form.setValue("password", ""); // Limpa o campo de senha
    }
  };

  return (
    <>
      <Head>
        <title>Entrar | App</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-teal-600">
            Entrar
          </h1>
          <Form form={form} onSubmit={handleSubmit}>
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="Digite seu email"
            />
            <FormField
              name="password"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full mt-5"
            >
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </Form>
          <div className="mt-4 text-center">
            <Link href="/signUp" className="text-teal-600 hover:underline">
              Não tem uma conta? Cadastre-se
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
