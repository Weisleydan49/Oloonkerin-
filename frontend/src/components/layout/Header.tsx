import React from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';

export const Header = () => {
  return (
    <header className="h-16 border-b border-border/50 glass flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center bg-secondary/50 rounded-full px-4 py-2 border border-border/50 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all w-96">
        <Search className="w-4 h-4 text-muted-foreground mr-2" />
        <input 
          type="text" 
          placeholder="Search projects, vehicles..." 
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground text-foreground"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-secondary transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full border border-background"></span>
        </button>
        <div className="h-8 w-px bg-border/50 mx-2"></div>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
          </div>
          <UserCircle className="w-8 h-8 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};
