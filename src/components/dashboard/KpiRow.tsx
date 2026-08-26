import React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from 'lucide-react';
import { kpis } from '../../data/analytics';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { cn } from '../../utils/cn';

export function KpiRow({ loading }: {loading: boolean;}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) =>
      <Card key={kpi.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[12.5px] font-medium text-body">{kpi.label}</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <DynamicIcon name={kpi.icon} className="h-4 w-4" />
            </span>
          </div>

          {loading ?
        <>
              <Skeleton className="mt-4 h-8 w-24" />
              <Skeleton className="mt-3 h-3 w-32" />
            </> :

        <>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="font-display text-[30px] font-medium leading-none text-ink">
                  {kpi.value}
                </p>
                <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11.5px] font-semibold',
                kpi.direction === 'up' && 'bg-success-bg text-success',
                kpi.direction === 'down' && 'bg-warning-bg text-warning',
                kpi.direction === 'flat' && 'bg-canvas text-body'
              )}>
              
                  {kpi.direction === 'up' ?
              <ArrowUpRightIcon className="h-3 w-3" /> :
              kpi.direction === 'down' ?
              <ArrowDownRightIcon className="h-3 w-3" /> :

              <MinusIcon className="h-3 w-3" />
              }
                  {kpi.delta}
                </span>
              </div>
              <p className="mt-2 text-[12px] text-subtle">{kpi.caption}</p>
            </>
        }
        </Card>
      )}
    </div>);

}