import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3Icon,
  ListOrderedIcon,
  LayersIcon,
  ArrowUpRightIcon,
} from 'lucide-react';
import { useAdminStore } from '../../contexts/AdminStore';
import { TONE_META } from '../../data/topics';
import { Card, CardHeader } from '../ui/Card';
import { ChartSkeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { fullNumber } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { ToneKey } from '../../types';

const TONE_FILL: Record<ToneKey, string> = {
  sky: 'var(--sky-line)',
  lavender: 'var(--lavender-line)',
  sand: 'var(--sand-line)',
  blush: 'var(--blush-line)',
  mist: 'var(--primary)',
};

const TONE_PROGRESS_BG: Record<ToneKey, string> = {
  sky: 'bg-sky-400/80 dark:bg-sky-400',
  lavender: 'bg-purple-400/80 dark:bg-purple-400',
  sand: 'bg-amber-500/80 dark:bg-amber-400',
  blush: 'bg-rose-400/80 dark:bg-rose-400',
  mist: 'bg-emerald-600/80 dark:bg-emerald-400',
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
    </div>
  );
}

export function TopicDemandChart({ loading }: { loading: boolean }) {
  const navigate = useNavigate();
  const { topics } = useAdminStore();
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

  const totalDemand = topics.reduce((sum, t) => sum + (t.demand || 0), 0) || 1;

  const data = [...topics]
    .sort((a, b) => (b.demand || 0) - (a.demand || 0))
    .map((t) => {
      const title = t.topicTitle || t.title || 'Untitled Topic';
      const demand = t.demand || 0;
      const share = Math.round((demand / totalDemand) * 100);
      return {
        id: t.id,
        title,
        demand,
        tone: (t.tone as ToneKey) || 'sky',
        icon: t.icon || 'Leaf',
        shortDescription: t.shortDescription || t.subtitle || '',
        share,
      };
    });

  const maxDemand = data.length > 0 ? Math.max(...data.map((d) => d.demand), 1) : 1;
  const chartHeight = Math.max(300, data.length * 44);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Topic demand distribution"
        description="Which packets people reach for when they cannot start the conversation themselves."
        action={
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-full border border-line bg-canvas px-2 py-0.5 text-[11.5px] font-medium text-subtle">
              {data.length} {data.length === 1 ? 'topic' : 'topics'}
            </span>

            <div className="flex rounded-md border border-line bg-canvas p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="Ranked Progress List view"
                aria-label="Ranked Progress List view"
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  viewMode === 'list'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-subtle hover:text-ink'
                )}
              >
                <ListOrderedIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('chart')}
                title="Bar Chart view"
                aria-label="Bar Chart view"
                className={cn(
                  'rounded px-2 py-1 text-xs font-medium transition-colors',
                  viewMode === 'chart'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-subtle hover:text-ink'
                )}
              >
                <BarChart3Icon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        }
      />

      {loading ? (
        <ChartSkeleton className="h-[318px]" />
      ) : data.length === 0 ? (
        <div className="flex h-[318px] flex-col items-center justify-center p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-subtle">
            <LayersIcon className="h-5 w-5" />
          </div>
          <p className="mt-2 text-[13.5px] font-medium text-ink">No topics available</p>
          <p className="mt-1 text-xs text-subtle">
            Create topics in the Topics Builder to begin tracking distribution.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Scrollable Container with Custom Scrollbar */}
          <div className="mha-scroll max-h-[318px] overflow-y-auto px-5 py-3">
            {viewMode === 'list' ? (
              <div className="space-y-3.5">
                {data.map((row, index) => {
                  const percentOfMax = Math.round((row.demand / maxDemand) * 100);
                  const toneMeta = TONE_META[row.tone];

                  return (
                    <div
                      key={row.id || row.title}
                      onClick={() => row.id && navigate(`/topics/edit/${row.id}`)}
                      className={cn(
                        'group relative flex cursor-pointer flex-col gap-1.5 rounded-lg border border-transparent p-2 transition-all duration-150',
                        'hover:border-line hover:bg-canvas/70 hover:shadow-xs'
                      )}
                      title={`Click to view/edit ${row.title}`}
                    >
                      {/* Topic Title, Tone Icon, and Demand Share */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={cn(
                              'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px]',
                              toneMeta?.chip || 'bg-canvas text-body'
                            )}
                          >
                            <DynamicIcon name={row.icon} className="h-3.5 w-3.5" />
                          </span>

                          <div className="min-w-0 flex items-center gap-1.5">
                            <span className="text-[11px] font-mono font-medium text-subtle">
                              #{index + 1}
                            </span>
                            <p className="truncate text-[13px] font-medium text-ink group-hover:text-primary transition-colors">
                              {row.title}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[12px] font-medium text-ink">
                            {fullNumber(row.demand)}
                          </span>
                          <span className="inline-flex min-w-[34px] justify-center rounded bg-canvas px-1.5 py-0.5 text-[11px] font-semibold text-subtle">
                            {row.share}%
                          </span>
                          <ArrowUpRightIcon className="h-3 w-3 text-subtle opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Visual Meter Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            TONE_PROGRESS_BG[row.tone] || 'bg-primary'
                          )}
                          style={{ width: `${percentOfMax}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ height: `${chartHeight}px` }} className="py-2 pr-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={130}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: 'var(--body)', fontSize: 12 }}
                    />
                    <RTooltip
                      content={<DemandTooltip />}
                      cursor={{ fill: 'var(--primary-tint)', opacity: 0.5 }}
                    />
                    <Bar dataKey="demand" radius={[0, 5, 5, 0]} barSize={14}>
                      {data.map((row) => (
                        <Cell key={row.title} fill={TONE_FILL[row.tone as ToneKey]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Subtle scroll indication footer info if more than 5 items */}
          {data.length > 5 && (
            <div className="flex items-center justify-between border-t border-line/60 bg-canvas/30 px-5 py-2 text-[11.5px] text-subtle">
              <span>Scroll to view all {data.length} topics</span>
              <button
                type="button"
                onClick={() => navigate('/topics')}
                className="font-medium text-primary hover:underline"
              >
                Manage all →
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}