"use client";
import { Provider } from "@/app/libs/ChakraProvider";
import fonts from "@/app/theme/fonts";
import { AuthProvider } from "@/app/libs/AuthProvider";
import Navbar from "@/app/componets/ui/Navbar";
import { Container } from "@chakra-ui/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={fonts.gotham.variable}>
        <AuthProvider>
          <Provider>
            <Navbar />
            <Container maxW="container.xl" pt={4}>
              {children}
            </Container>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
