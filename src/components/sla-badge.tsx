import { cn } from '@/lib/utils';
import { getSlaStatus, getTimeLabel, type SlaStatus } from '@/modules/cases/domain/sla';
import type React from 'react';

interface SlaBadgeProps {
  deadline: Date | null | undefined;
  priority: number;
  className?: string;
}

const config: Record<SlaStatus, { label: string; style: React.CSSProperties }> = {
  none:     { label: 'No SLA',  style: {} },
  on_track: { label: 'On Track', style: { color: 'var(--relay-good)',      backgroundColor: 'var(--relay-good-soft)' } },
  at_risk:  { label: 'At Risk',  style: { color: 'var(--relay-warn)',      backgroundColor: 'var(--relay-warn-soft)' } },
  breached: { label: 'Breached', style: { color: 'var(--relay-bad)',       backgroundColor: 'var(--relay-bad-soft)'  } },
};

export function SlaBadge({ deadline, priority, className }: SlaBadgeProps) {
  const status = getSlaStatus(deadline, priority);
  const timeLabel = getTimeLabel(deadline);
  const { label, style } = config[status];

  return (
    <span
      className={cn(
        'inline-flex h-5 items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        status === 'none' && 'bg-muted text-muted-foreground',
        className,
      )}
      style={status !== 'none' ? style : undefined}
    >
      {label}
      {timeLabel && <span className="opacity-75">· {timeLabel}</span>}
    </span>
  );
}
