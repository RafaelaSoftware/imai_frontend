"use client";

import theme from "@/app/theme";
import fonts from "@/app/theme/fonts";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

export function Provider({ children }) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-nunito: ${fonts.nunito.style.fontFamily};
            --font-gotham: ${fonts.gotham.style.fontFamily};
          }
        `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </>
  );
}
