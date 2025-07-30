import { ThemeProvider } from "../components/theme-provider";
import { DashboardLayout } from "../components/dashboard-layout";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardLayout />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
