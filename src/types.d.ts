declare module "@fontsource/sora";
declare module "vite-plugin-eslint";
// src/theme.d.ts or src/@types/mui.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    customColors: {
      [key: string]: string; // Index signature for numeric keys
    };
    common: {
      dark: string;
      light: string;
      white: string;
      black: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      [key: string]: string; // Index signature for numeric keys
    };
  }
}

declare module "@mui/material" {
  interface Color {
    [key: string]: string; // Index signature for numeric keys
  }
}
