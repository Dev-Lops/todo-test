import { useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

type ClockSectionProps = {
  greeting: string;
  onLogout?: () => void;
};

const CLOCK_NUMBERS = [
  { number: 1, left: 73, top: 10 },
  { number: 2, left: 90.3, top: 26.3 },
  { number: 3, left: 95, top: 50 },
  { number: 4, left: 90.3, top: 70 },
  { number: 5, left: 75, top: 88.3 },
  { number: 6, left: 50, top: 95 },
  { number: 7, left: 25, top: 88.3 },
  { number: 8, left: 10, top: 72 },
  { number: 9, left: 4, top: 50 },
  { number: 10, left: 10, top: 30 },
  { number: 11, left: 25, top: 13 },
  { number: 12, left: 50, top: 5 },
];

const ClockSection = ({ greeting, onLogout }: ClockSectionProps) => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();
      const hours = now.getHours();

      if (secondRef.current) {
        secondRef.current.style.transform = `rotate(${seconds * 6}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `rotate(${minutes * 6 + seconds * 0.1}deg)`;
      }
      if (hourRef.current) {
        hourRef.current.style.transform = `rotate(${hours * 30 + minutes * 0.5}deg)`;
      }
    };

    const interval = setInterval(updateClock, 1000);
    updateClock(); // Atualiza o relógio imediatamente

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      localStorage.removeItem('authToken');

      if (onLogout) {
        onLogout();
      }

      router.push('/signin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Ocorreu um erro ao fazer logout. Tente novamente.');
    }
  };

  return (
    <div className="bg-white mt-4 rounded-lg shadow p-4 w-11/12 flex flex-col items-center">
      <div className="relative w-52 h-52 bg-blue-100 rounded-full flex items-center justify-center">
        {/* Números do relógio */}
        {CLOCK_NUMBERS.map(({ number, left, top }) => (
          <span
            key={number}
            className="absolute text-xs font-medium text-gray-800 "
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {number}
          </span>
        ))}

        {/* Ponteiros */}
        <div
          ref={hourRef}
          className="absolute w-[3px] h-10 bg-blue-600 rounded-full origin-bottom"
          style={{
            transform: "rotate(0deg)",
            bottom: "50%",
            left: "calc(50% - 1.5px)"
          }}
        ></div>
        <div
          ref={minuteRef}
          className="absolute w-[2px] h-14 bg-blue-400 rounded-full origin-bottom"
          style={{
            transform: "rotate(0deg)",
            bottom: "50%",
            left: "calc(50% - 1px)"
          }}
        ></div>
        <div
          ref={secondRef}
          className="absolute w-[1px] h-16 bg-red-500 rounded-full origin-bottom"
          style={{
            transform: "rotate(0deg)",
            bottom: "50%",
            left: "50%"
          }}
        ></div>
        {/* Centro do relógio */}
        <div className="absolute w-1 h-1 bg-black rounded-full"></div>
      </div>
      <p className="text-xs font-medium text-black mt-2">{greeting}</p>

      {/* Botão de logout */}
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
      >
        Sair
      </button>
    </div>
  );
};

export default ClockSection;
