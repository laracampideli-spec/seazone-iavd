import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Seazone IAVD",
  description: "Plataforma de avaliação de desempenho com IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-surface">
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
