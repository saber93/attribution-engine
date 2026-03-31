import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function KpiCard({ title, value, change, trend, icon, className, gradient }: KpiCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border bg-card p-5 transition-all duration-200 hover:shadow-md",
      gradient && "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
        {icon && (
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend === 'up' ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
          )}
          <span className={cn(
            "text-xs font-semibold",
            trend === 'up' ? "text-success" : "text-destructive"
          )}>
            {trend === 'up' ? '+' : ''}{change}%
          </span>
          <span className="text-xs text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
