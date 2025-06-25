
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import React from "react";

const DarkModeSwitch = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center space-x-2 ml-2"
    >
      <Sun className={`w-5 h-5 ${!isDark ? "text-yellow-500" : "text-gray-400"}`} />
      <Switch checked={isDark} onCheckedChange={v => setTheme(v ? "dark" : "light")} />
      <Moon className={`w-5 h-5 ${isDark ? "text-yellow-300" : "text-gray-400"}`} />
    </button>
  );
};
export default DarkModeSwitch;
