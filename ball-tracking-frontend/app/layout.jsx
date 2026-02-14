import "./globals.css";

export const metadata = {
  title: "Free Ball Tracking System",
  description: "AI-based cricket ball tracking & LBW analysis"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
