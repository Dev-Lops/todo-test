import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";

type SigninInput = {

  email: string;
  password: string;

}

export const SigninForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    const password = (event.target as HTMLFormElement).password.value;

    const result = await signIn("credentials", {
      redirect: false, // Não redirecione imediatamente para depuração
      email,
      password,
      callbackUrl: "/dashboard",
    });

    if (result?.ok) {
      // Redireciona manualmente após login bem-sucedido
      window.location.href = result.url || "/dashboard";
    } else {
      alert("Login failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-[380px] gap-6">
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full px-3 py-4 rounded-lg placeholder:text-[#000] placeholder:text-[13px] font-poppins"
        required
      />
      <button
        type="submit"
        className="w-full bg-[#50C2C9] text-white px-3 py-4 rounded-lg font-poppins hover:bg-[#4db3bd] transition-colors"
      >
        Login
      </button>
    </form>
  );
};
