import { useColorScheme } from "react-native";
import { BistroColors, getBistroColors } from "../theme/bistroTheme";

export function useBistroTheme(): { colors: BistroColors; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { colors: getBistroColors(scheme), isDark };
}
