"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
