import { useEffect, useState } from 'react';
import { Truck, Droplets, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { getProjects } from '../api/projects';
import { getFuelLogs } from '../api/fuel';
import { getVehicles } from '../api/vehicles';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, description, loading }: any) => (
  <div className="glass rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {loading ? (
          <div className="h-9 w-24 bg-secondary animate-pulse rounded mt-1"></div>
        ) : (
          <h3 className="text-3xl font-bold mt-1 text-foreground">{value}</h3>
        )}
      </div>
      <div className="p-3 bg-primary/10 text-primary rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center text-sm">
      <span className={`font-medium flex items-center ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground'}`}>
        {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : trend === 'down' ? <AlertCircle className="w-4 h-4 mr-1" /> : null}
        {trendValue}
      </span>
      <span className="text-muted-foreground ml-2">{description}</span>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
  </div>
);

export const Dashboard = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    vehiclesCount: 0,
    totalFuelLitres: 0,
    recentFuelLogs: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projects, vehicles, fuelLogs] = await Promise.all([
          getProjects(),
          getVehicles(),
          getFuelLogs()
        ]);

        const totalLitres = fuelLogs.reduce((acc, log) => acc + log.litres, 0);

        setStats({
          projectsCount: projects.length,
          vehiclesCount: vehicles.length,
          totalFuelLitres: totalLitres,
          recentFuelLogs: fuelLogs.slice(0, 5)
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          value={stats.vehiclesCount} 
          icon={Truck} 
          trend="up" 
          trendValue="Live" 
          description="Total registered" 
          loading={loading}
        />
        <StatCard 
          title="Fuel Consumed" 
          value={`${stats.totalFuelLitres.toLocaleString()} L`} 
          icon={Droplets} 
          trend="up" 
          trendValue="Live" 
          description="Total recorded" 
          loading={loading}
        />
        <StatCard 
          title="Active Projects" 
          value={stats.projectsCount} 
          icon={MapPin} 
          trend="up" 
          trendValue="Live" 
          description="Currently active" 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl border border-border/50 flex flex-col h-96">
          <div className="p-6 border-b border-border/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Recent Fuel Logs</h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">Loading logs...</div>
            ) : stats.recentFuelLogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">No fuel logs found.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                    <th className="px-4 py-3">Vehicle</th>
                    <th className="px-4 py-3">Litres</th>
                    <th className="px-4 py-3 rounded-tr-lg">Cost (KSH)</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentFuelLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3">{new Date(log.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-medium">{log.vehicle_id.split('-')[0]}</td>
                      <td className="px-4 py-3">{log.litres} L</td>
                      <td className="px-4 py-3">{log.cost_ksh.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="glass rounded-xl border border-border/50 flex flex-col h-96">
          <div className="p-6 border-b border-border/50">
            <h3 className="font-semibold text-lg">Recent Alerts</h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No recent alerts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
