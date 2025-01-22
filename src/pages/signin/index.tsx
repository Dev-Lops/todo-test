import { SigninForm } from "@/components/SigninForm";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

    const result = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard", // Redireciona após login bem-sucedido
    });

    if (!result?.ok) {
      alert("Login failed!");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen text-background bg-[#F0F4F3]">
      <h1 className=" text-poppins text-[18px] font-bold">Welcome back</h1>
      <Image src="/signin.png" alt="signin" width={150} height={150} className="mb-5" />

      <SigninForm />
      <p className="text-[13px] font-poppins mt-5">Don’t have an account? <Link href="/signup" className="text-[#50C2C9]">Sign Up</Link></p>
    </div>
  )
}