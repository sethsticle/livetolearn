import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./components/dashboard/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Kumbh_Sans } from 'next/font/google';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });
const lora = Kumbh_Sans({
  weight: ['400', '700'], // Specify the weights you want to use
  subsets: ['latin'], // Choose the subsets you need (e.g., 'latin')
  display: 'swap', // Ensure a better user experience by swapping the font when it's loaded
});

export const metadata: Metadata = {
  title: "Study Buddy",
  description: "Live to Learn",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.className} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
          {children}
          <Toaster richColors closeButton/>

        </ThemeProvider>
      </body>
    </html>
  );
}
