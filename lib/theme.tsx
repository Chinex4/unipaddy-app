import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";

type Mode = "light" | "dark" | "system";

const ThemeCtx = createContext<{
  mode: Mode;
  setMode: (m: Mode) => void;
}>({ mode: "light", setMode: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("light");

  useEffect(() => {
    (async () => {
      const saved = (await AsyncStorage.getItem(
        "up_theme_mode"
      )) as Mode | null;
      if (saved) setModeState(saved);
    })();
  }, []);

  const setMode = async (m: Mode) => {
    setModeState(m);
    await AsyncStorage.setItem("up_theme_mode", m);
    // Optional: tint system nav bar lightly on Android
    if (m === "dark") SystemUI.setBackgroundColorAsync("#0B0F1A");
    else SystemUI.setBackgroundColorAsync("#FFFFFF");
  };

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useThemeMode = () => useContext(ThemeCtx);
