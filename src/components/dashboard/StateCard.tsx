import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "./EmptyState";

type StateCardProps = ComponentProps<typeof EmptyState> & {
  cardClassName?: string;
};

export function StateCard({ cardClassName, ...emptyStateProps }: StateCardProps) {
  return (
    <Card className={cn("rounded-2xl", cardClassName)}>
      <CardContent className="p-0">
        <EmptyState {...emptyStateProps} />
      </CardContent>
    </Card>
  );
}
