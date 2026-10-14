import "../globals.css";

export const metadata = {
  title: "Register",
  description: "Register for this website",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="en" className={` h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
