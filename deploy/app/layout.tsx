import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "LocationsHub Admin",
  description: "Admin Dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (

    <html lang="en">

      <body className="bg-gray-100">

        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000
          }}
        />

      </body>

    </html>

  );

}