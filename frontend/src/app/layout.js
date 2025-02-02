import { Roboto } from "next/font/google";
import "./globals.css";
import Footer from '../components/Footer';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "QuizGenerate",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
