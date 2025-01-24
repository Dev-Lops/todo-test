import "@/styles/globals.css";
import { AppProps } from 'next/app';
import { Poppins } from "next/font/google";
import { AuthProvider } from '../contexts/AuthContext';


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
        <main className={poppins.className}>
          <Component {...pageProps} />
        </main>
    </AuthProvider>
  );
}

export default MyApp;
