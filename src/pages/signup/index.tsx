import { RegisterForm } from "@/components/RegistForm";
import Link from "next/link";

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-background">
      <h1 className="text-[18px] font-bold font-poppins mb-7">Welcome to Onboard</h1>
      <p className="text-[13px] font-poppins mb-10">Let’s help to meet up your tasks.</p>

      <RegisterForm />
      <p className="text-[13px] font-poppins mt-5">Already have an account? <Link href="/signin" className="text-[#50C2C9]">Login</Link></p>
    </div>
  )
}