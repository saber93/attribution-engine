import { useState } from "react";
import { Search, Bell, Plus, Sun, Moon, Calendar, Filter, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/components/ThemeProvider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur px-4">
        <SidebarTrigger className="shrink-0" />

        <div className="flex-1 flex items-center gap-2 min-w-0">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 text-muted-foreground w-64" onClick={() => setSearchOpen(true)}>
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Search everything...</span>
            <kbd className="ml-auto pointer-events-none text-[10px] font-mono text-muted-foreground/70 bg-muted rounded px-1.5 py-0.5">⌘K</kbd>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Last 30 days
          </Button>

          <Button variant="outline" size="sm" className="hidden lg:flex gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5" />
            All Platforms
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>New Lead</DropdownMenuItem>
              <DropdownMenuItem>New Contact</DropdownMenuItem>
              <DropdownMenuItem>New Deal</DropdownMenuItem>
              <DropdownMenuItem>New Task</DropdownMenuItem>
              <DropdownMenuItem>Log Activity</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  SC
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sarah Chen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-lg p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="sr-only">Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 px-4 pb-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input placeholder="Search campaigns, leads, deals, contacts..." className="border-0 focus-visible:ring-0 px-0 text-sm" autoFocus />
          </div>
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            <p>Try searching for "TechCorp" or "Brand Awareness"</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
