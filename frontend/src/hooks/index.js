import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { NotificationContext } from "../context/NotificationProvider";
import { AuthContext } from "../context/AuthProvider";
import { SearchContext } from "../context/SearchProvider";

export function useTheme() {
  const context = useContext(ThemeContext);

  return context;
}

export function useNotification() {
  const context = useContext(NotificationContext);

  return context;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export function useSearch() {
  const context = useContext(SearchContext);

  return context;
}
