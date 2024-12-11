import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const checkAdminCredentials = () => {
  const storedCredentials = localStorage.getItem("adminCredentials");

  if (storedCredentials) {
    try {
      const credentials = JSON.parse(storedCredentials);

      if (credentials.username && credentials.password) {
        return true;
      }
    } catch (error) {
      console.error("Invalid credentials format in local storage.");
    }
  }

  return false;
};

export function formatDate(inputDate) {
  const date = new Date(inputDate);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
