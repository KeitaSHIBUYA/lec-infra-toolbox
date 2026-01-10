"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// localStorage用のsubscribe関数
function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// テーマを取得する関数
function getThemeSnapshot(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  return stored ?? "system";
}

// SSR用のサーバースナップショット
function getServerSnapshot(): Theme {
  return "system";
}

// システムのダークモード設定を取得
function getSystemDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStoreでlocalStorageから直接読み込み
  const theme = useSyncExternalStore(
    subscribeToStorage,
    getThemeSnapshot,
    getServerSnapshot,
  );

  // 解決されたテーマを計算
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (getSystemDarkMode() ? "dark" : "light") : theme;

  // html 要素に dark クラスを追加/削除 & システム設定の監視
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // システム設定の変更を監視
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolved = mediaQuery.matches ? "dark" : "light";
        if (newResolved === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolvedTheme]);

  // テーマを保存
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    // storageイベントを手動で発火させて再レンダリングをトリガー
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
