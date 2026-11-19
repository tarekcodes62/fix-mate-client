'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: Props) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;
