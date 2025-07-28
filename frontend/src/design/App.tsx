import { ThemeProvider } from "./components/ThemeProvider";
import { DashboardLayout } from "./components/DashboardLayout";
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