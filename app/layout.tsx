import type { Metadata } from "next";
import "./globals.css";
import { IdiomaProvider } from "../IdiomaContext";

export const metadata: Metadata = {
  title: "Urbiza - Portal inmobiliario República Dominicana",
  description: "Encuentra tu próxima propiedad en República Dominicana. Apartamentos, villas, terrenos y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" id="favicon-link" />
      </head>
      <body>
        <IdiomaProvider>
          {children}
        </IdiomaProvider>
      </body>
    </html>
  );
}