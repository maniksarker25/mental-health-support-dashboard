import React from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from 'recharts';
import { useAdminStore } from '../../contexts/AdminStore';
import { Card, CardHeader } from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';
import { fullNumber } from '../../utils/format';
import type { ToneKey } from '../../types';

const TONE_FILL: Record<ToneKey, string> = {
  sky: 'var(--sky-line)',
  lavender: 'var(--lavender-line)',
  sand: 'var(--sand-line)',
  blush: 'var(--blush-line)',
  mist: 'var(--primary)'
};

function DemandTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="text-[12.5px] font-medium text-ink">{row.title}</p>
      <p className="mt-0.5 text-[12px] text-body">
        {fullNumber(row.demand)} requests · {row.share}% of demand
      </p>
    </div>);

}

export function TopicDemandChart({ loading }: {loading: boolean;}) {
  const { topics } = useAdminStore();
  const total = topics.reduce((sum, t) => sum + t.demand, 0) || 1;
  const data = [...topics].
  sort((a, b) => b.demand - a.demand).
  map((t) => ({
    title: t.title,
    demand: t.demand,
    tone: t.tone,
    share: Math.round(t.demand / total * 100)
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Topic demand distribution"
        description="Which packets people reach for when they cannot start the conversation themselves." />
      
      {loading ?
      <ChartSkeleton className="h-[320px]" /> :

      <div className="h-[320px] py-4 pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 8 }}>
              <XAxis type="number" hide />
              <YAxis
              type="category"
              dataKey="title"
              width={132}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'var(--body)', fontSize: 12 }} />
            
              <RTooltip content={<DemandTooltip />} cursor={{ fill: 'var(--primary-tint)', opacity: 0.5 }} />
              <Bar dataKey="demand" radius={[0, 5, 5, 0]} barSize={16}>
                {data.map((row) =>
              <Cell key={row.title} fill={TONE_FILL[row.tone as ToneKey]} />
              )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      }
    </Card>);

}