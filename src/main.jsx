import { createRoot } from "react-dom/client";
import "./index.css";
import RouterMain from "./router/index.routes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={RouterMain} />
    <Toaster richColors closeButton />
  </AuthProvider>
);
