import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TaskListPanel from "@/components/TaskListPanel";
import { TaskListProvider } from "@/contexts/TaskListContext";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Well Classificador",
  description: "Classificador de Questões da OBI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.className} antialiased`}
      >
        <TaskListProvider>
          <Navbar />
          {children}
          <TaskListPanel />
        </TaskListProvider>
      </body>
    </html>
  );
}
