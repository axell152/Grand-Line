import "./globals.css";

export const metadata = {
  title: "Grand Line Tactics",
  description: "Jeu d'exploration et de combat au tour par tour, inspiré de One Piece — usage personnel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
