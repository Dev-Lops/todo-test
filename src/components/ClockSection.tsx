import { useEffect, useRef } from "react";

type ClockSectionProps = {
  greeting: string;
};

const CLOCK_NUMBERS = [
  { number: 1, left: 75, top: 8 },
  { number: 2, left: 93.3, top: 26.3 },
  { number: 3, left: 100, top: 50 },
  { number: 4, left: 93.3, top: 75 },
  { number: 5, left: 75, top: 93.3 },
  { number: 6, left: 50, top: 100 },
  { number: 7, left: 25, top: 93.3 },
  { number: 8, left: 6.7, top: 75 },
  { number: 9, left: 0, top: 50 },
  { number: 10, left: 6.7, top: 25 },
  { number: 11, left: 25, top: 6.7 },
  { number: 12, left: 50, top: 0 },
];

const ClockSection = ({ greeting }: ClockSectionProps) => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white mt-4 rounded-lg shadow p-4 w-11/12 flex flex-col items-center">
      <div className="relative w-40 h-40 bg-blue-100 rounded-full flex items-center justify-center">
        {/* Números do relógio */}
        {CLOCK_NUMBERS.map(({ number, left, top }) => (
          <span
            key={number}
            className="absolute text-xs font-medium text-gray-800"
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
    </div>
  );
};

export default ClockSection;
