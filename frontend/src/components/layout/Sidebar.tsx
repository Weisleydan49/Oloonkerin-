import React from 'react';
import { LayoutDashboard, Truck, Droplets, Wrench, MapPin, Users, Banknote, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: MapPin },
  { name: 'Vehicles & Machinery', href: '/vehicles', icon: Truck },
  { name: 'Fuel Logs', href: '/fuel', icon: Droplets },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Supervisors & Drivers', href: '/people', icon: Users },
  { name: 'Payroll', href: '/payroll', icon: Banknote },
];

export const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen border-r border-border/50 glass">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-wider text-primary">OLOONKERIN</h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Management</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
