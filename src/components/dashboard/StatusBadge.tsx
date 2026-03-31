import { cn } from "@/lib/utils";

type StatusType = 'new' | 'active' | 'paused' | 'completed' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'won' | 'lost' | 'overdue' | 'draft' | 'proposal' | 'negotiation';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-info/10 text-info border-info/20' },
  active: { label: 'Active', className: 'bg-success/10 text-success border-success/20' },
  paused: { label: 'Paused', className: 'bg-warning/10 text-warning border-warning/20' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  contacted: { label: 'Contacted', className: 'bg-warning/10 text-warning border-warning/20' },
  qualified: { label: 'Qualified', className: 'bg-success/10 text-success border-success/20' },
  unqualified: { label: 'Unqualified', className: 'bg-muted text-muted-foreground border-border' },
  converted: { label: 'Converted', className: 'bg-primary/10 text-primary border-primary/20' },
  won: { label: 'Won', className: 'bg-success/10 text-success border-success/20' },
  lost: { label: 'Lost', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  overdue: { label: 'Overdue', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground border-border' },
  proposal: { label: 'Proposal', className: 'bg-primary/10 text-primary border-primary/20' },
  negotiation: { label: 'Negotiation', className: 'bg-warning/10 text-warning border-warning/20' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.new;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
