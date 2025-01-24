import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";

export default function Tasks() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <h1 className="text-5xl text-black animate-pulse">Em construção!</h1>
      <p className="text-gray-600 mt-4 w-[400px] text-center text-xs">
        A página de tarefas ainda não está disponível. Em breve, você poderá
        gerenciar suas tarefas por aqui!
      </p>

      <Link href="/" className="mt-4">
        <Button>Voltar</Button>
      </Link>
    </div>
  );
}
