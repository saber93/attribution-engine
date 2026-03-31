import { cn } from "@/lib/utils";
import type { Platform } from "@/data/mock-data";

const platformConfig: Record<Platform, { label: string; className: string }> = {
  google: { label: 'Google', className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  meta: { label: 'Meta', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' },
  tiktok: { label: 'TikTok', className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  linkedin: { label: 'LinkedIn', className: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  snapchat: { label: 'Snap', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
};

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
