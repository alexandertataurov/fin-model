import { useState } from 'react'
import { useTheme } from '../components/theme-hooks'
import { Button } from '../components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Sun, Moon, Menu } from 'lucide-react'
import { PLTab } from '../components/tabs/PLTab'
import { CashFlowTab } from '../components/tabs/CashFlowTab'
import { BalanceTab } from '../components/tabs/BalanceTab'
import { ParametersTab } from '../components/tabs/ParametersTab'
import { SalesTab } from '../components/tabs/SalesTab'
import { FilterSidebar } from '../components/filter-sidebar'
import { FileUpload } from '../components/file-upload'
import { Toaster } from '../components/ui/sonner'

export default function TemplateDashboard() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('pl')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-card backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <FilterSidebar />
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold">Financial Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <FileUpload />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 border-r bg-card min-h-[calc(100vh-4rem)] sticky top-16">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="pl">P&L</TabsTrigger>
                <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
                <TabsTrigger value="balance">Balance</TabsTrigger>
                <TabsTrigger value="params">Parameters</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
              </TabsList>

              <TabsContent value="pl" className="mt-0">
                <PLTab />
              </TabsContent>
              <TabsContent value="cashflow" className="mt-0">
                <CashFlowTab />
              </TabsContent>
              <TabsContent value="balance" className="mt-0">
                <BalanceTab />
              </TabsContent>
              <TabsContent value="params" className="mt-0">
                <ParametersTab />
              </TabsContent>
              <TabsContent value="sales" className="mt-0">
                <SalesTab />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}