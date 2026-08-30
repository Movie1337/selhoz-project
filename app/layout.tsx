import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "АгроСвязь — аграрная торговая и сервисная платформа",
  description: "Покупка, продажа и поиск аграрных услуг в одном месте."
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ru"><body><Header/>{children}<Footer/></body></html>;
}