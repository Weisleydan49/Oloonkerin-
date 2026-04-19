import React from 'react';
import { Truck, Droplets, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, description }: any) => (
  <div className="glass rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-3xl font-bold mt-1 text-foreground">{value}</h3>
      </div>
      <div className="p-3 bg-primary/10 text-primary rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`font-medium flex items-center ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <AlertCircle className="w-4 h-4 mr-1" />}
        {trendValue}
      </span>
      <span className="text-muted-foreground ml-2">{description}</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Active Machines" 
          value="42" 
          icon={Truck} 
          trend="up" 
          trendValue="+3" 
          description="from last week" 
        />
        <StatCard 
          title="Fuel Consumed" 
          value="12,450 L" 
          icon={Droplets} 
          trend="up" 
          trendValue="+12%" 
          description="from yesterday" 
        />
        <StatCard 
          title="Active Projects" 
          value="8" 
          icon={MapPin} 
          trend="down" 
          trendValue="0" 
          description="same as last month" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl border border-border/50 flex flex-col h-96">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Fuel Consumption Trend</h3>
            <select className="bg-secondary text-sm rounded-md border border-border/50 px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Chart visualization placeholder</p>
          </div>
        </div>

        <div className="glass rounded-xl border border-border/50 flex flex-col h-96">
          <div className="p-6 border-b border-border/50">
            <h3 className="font-semibold text-lg">Recent Alerts</h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="mt-0.5">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">High fuel usage detected</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Truck KCD 123X • 2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
