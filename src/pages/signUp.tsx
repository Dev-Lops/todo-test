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

  const handleSubmit = async (data: SignUpData) => {
    try {
      await signUp(data);
      setToast({
        message: "Conta criada com sucesso! Redirecionando...",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Erro ao criar conta",
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
            <FormField name="name" label="Nome" placeholder="Digite seu nome" />
            <FormField
              name="email"
              label="Email"
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
              {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
