import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis
} from
  'recharts';
import { RANGE_LABELS, dispatchTrends } from '../../data/analytics';
import type { TrendRange } from '../../types';
import { Card, CardHeader } from '../ui/Card';
import { SegmentedControl } from '../ui/Field';
import { ChartSkeleton } from '../ui/Skeleton';
import { fullNumber } from '../../utils/format';

const RANGES: TrendRange[] = ['7d', '30d', '90d', '1y'];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum: number, p: any) => sum + (p.value ?? 0), 0);
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle">{label}</p>
      {payload.map((p: any) =>
        <p key={p.dataKey} className="flex items-center gap-2 text-[12.5px] text-body">
          <span className="h-2 w-2 rounded-full" style={{ background: p.stroke }} />
          <span className="capitalize">{p.dataKey === 'sms' ? 'SMS' : 'Email'}</span>
          <span className="ml-auto font-medium text-ink">{fullNumber(p.value)}</span>
        </p>
      )}
      <p className="mt-1.5 border-t border-line pt-1.5 text-[12px] text-body">
        Total <span className="font-medium text-ink">{fullNumber(total)}</span>
      </p>
    </div>);

}

export function DispatchTrendChart({ loading }: { loading: boolean; }) {
  const [range, setRange] = useState<TrendRange>('7d');
  const data = dispatchTrends[range];
  const total = data.reduce((sum, d) => sum + d.sms + d.email, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Dispatch volume trends"
        description={`${fullNumber(total)} packets delivered across SMS and email in the last ${RANGE_LABELS[range]}.`}
        action={
          <SegmentedControl
            ariaLabel="Trend range"
            value={range}
            onChange={setRange}
            options={RANGES.map((r) => ({ value: r, label: RANGE_LABELS[r] }))} />

        } />

      <div className="flex items-center gap-5 px-5 pt-4">
        <span className="flex items-center gap-2 text-[12.5px] text-body">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> SMS
        </span>
        <span className="flex items-center gap-2 text-[12.5px] text-body">
          <span className="h-2.5 w-2.5 rounded-sm bg-sky-line" /> Email
        </span>
      </div>
      {loading ?
        <ChartSkeleton className="h-[350px]" /> :

        <div className="h-[370px] px-2 pb-3 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'var(--subtle)', fontSize: 11.5 }}
                dy={8} />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                tick={{ fill: 'var(--subtle)', fontSize: 11.5 }} />

              <RTooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--line)' }} />
              <Area
                type="monotone"
                dataKey="sms"
                stroke="var(--primary)"
                strokeWidth={2}
                fill="var(--primary)"
                fillOpacity={0.12}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 0 }} />

              <Area
                type="monotone"
                dataKey="email"
                stroke="var(--sky-line)"
                strokeWidth={2}
                fill="var(--sky-line)"
                fillOpacity={0.16}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 0 }} />

            </AreaChart>
          </ResponsiveContainer>
        </div>
      }
    </Card>);

}