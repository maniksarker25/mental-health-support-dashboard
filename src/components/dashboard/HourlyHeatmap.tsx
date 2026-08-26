import React from 'react';
import { heatmap, heatmapDays } from '../../data/analytics';
import { Card, CardHeader } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Tooltip } from '../ui/Tooltip';

const HOUR_LABELS = [0, 4, 8, 12, 16, 20];

function hourLabel(hour: number): string {
  if (hour === 0) return '12a';
  if (hour === 12) return '12p';
  return hour < 12 ? `${hour}a` : `${hour - 12}p`;
}

export function HourlyHeatmap({ loading }: {loading: boolean;}) {
  const max = Math.max(...heatmap.map((c) => c.value));
  const peak = heatmap.reduce((best, cell) => cell.value > best.value ? cell : best, heatmap[0]);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Hourly transmission heatmap"
        description={`Support requests cluster at night — the busiest hour is ${hourLabel(peak.hour)} on ${peak.day}.`} />
      
      {loading ?
      <div className="space-y-2 px-5 py-6">
          {heatmapDays.map((d) =>
        <Skeleton key={d} className="h-5 w-full" />
        )}
        </div> :

      <div className="mha-scroll overflow-x-auto px-5 py-5">
          <div className="min-w-[520px]">
            {heatmapDays.map((day) =>
          <div key={day} className="mb-1 flex items-center gap-2">
                <span className="w-8 shrink-0 text-[11px] font-medium text-subtle">{day}</span>
                <div className="grid flex-1 grid-cols-24 gap-1" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                  {heatmap.
              filter((c) => c.day === day).
              map((cell) => {
                const intensity = cell.value / max;
                return (
                  <Tooltip
                    key={`${day}-${cell.hour}`}
                    className="w-full"
                    label={`${hourLabel(cell.hour)} · ${cell.value} packets`}>
                    
                          <span
                      tabIndex={0}
                      className="block h-5 w-full rounded-[3px] border border-line/60 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      style={{
                        backgroundColor: 'var(--primary)',
                        opacity: 0.08 + intensity * 0.92
                      }} />
                    
                        </Tooltip>);

              })}
                </div>
              </div>
          )}

            <div className="mt-3 flex items-center gap-2 pl-10">
              <div
              className="grid flex-1 gap-1"
              style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
              
                {Array.from({ length: 24 }, (_, hour) =>
              <span key={hour} className="text-center text-[10px] text-subtle">
                    {HOUR_LABELS.includes(hour) ? hourLabel(hour) : ''}
                  </span>
              )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
            <span className="text-[11.5px] text-subtle">Quiet</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) =>
          <span
            key={o}
            className="h-3 w-6 rounded-[3px]"
            style={{ backgroundColor: 'var(--primary)', opacity: o }} />

          )}
            <span className="text-[11.5px] text-subtle">Peak</span>
          </div>
        </div>
      }
    </Card>);

}