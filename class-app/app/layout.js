import { Heebo } from "next/font/google";
import "./globals.css";
import Layout from "../components/global/Layout";
import "react-loading-skeleton/dist/skeleton.css";

const heebo = Heebo({ subsets: ["hebrew", "latin"], weight: ["variable"] });

export const metadata = {
  title: "Class",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={`${heebo.className} bg-[#CCD6EB] h-screen`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
