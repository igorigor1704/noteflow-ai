export type ThemeMode = "light" | "dark" | "focus";

export const themes = {
  light: {
    background: "bg-slate-100",
    card: "bg-white",
    text: "text-slate-900"
  },

  dark: {
    background: "bg-slate-950",
    card: "bg-slate-900",
    text: "text-slate-100"
  },

  focus: {
    background: "bg-neutral-950",
    card: "bg-neutral-900",
    text: "text-neutral-100"
  }
};