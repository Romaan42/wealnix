import "../globals.css";
import Header from "@/components/Header";
import StoreProvider from "./storeProvider";

export const metadata = {
  title: "WEALNIX | BY ROMAN",
  description: "buy the digital products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <div className="flex min-h-screen bg-[#f5f7fb] font-sans">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
