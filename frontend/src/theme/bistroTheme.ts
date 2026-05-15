export type BistroColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  chip: string;
  chipText: string;
  accent: string;
  accentSoft: string;
  accentBorder: string;
  tabBar: string;
  tabInactive: string;
  placeholder: string;
  inputBg: string;
  qtyRow: string;
  qtyBtn: string;
  shadow: string;
  statusBar: "light-content" | "dark-content";
};

export const lightColors: BistroColors = {
  background: "#F8F9FA",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#888888",
  border: "#F0F0F0",
  chip: "#F0F0F0",
  chipText: "#666666",
  accent: "#FF6B6B",
  accentSoft: "#FFF5F5",
  accentBorder: "#FFE0E0",
  tabBar: "#FFFFFF",
  tabInactive: "#999999",
  placeholder: "#AAAAAA",
  inputBg: "#F8F9FA",
  qtyRow: "#FFF5F5",
  qtyBtn: "#FFFFFF",
  shadow: "#000000",
  statusBar: "dark-content",
};

export const darkColors: BistroColors = {
  background: "#0F0F0F",
  surface: "#1A1A1A",
  card: "#242424",
  text: "#F5F5F5",
  textSecondary: "#A0A0A0",
  border: "#2E2E2E",
  chip: "#2E2E2E",
  chipText: "#CCCCCC",
  accent: "#FF6B6B",
  accentSoft: "#2A1A1A",
  accentBorder: "#4A2A2A",
  tabBar: "#1A1A1A",
  tabInactive: "#777777",
  placeholder: "#666666",
  inputBg: "#2A2A2A",
  qtyRow: "#2A1A1A",
  qtyBtn: "#333333",
  shadow: "#000000",
  statusBar: "light-content",
};

export function getBistroColors(scheme: "light" | "dark" | null | undefined): BistroColors {
  return scheme === "dark" ? darkColors : lightColors;
}
