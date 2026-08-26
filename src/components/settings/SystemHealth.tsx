import React from 'react';
import { ActivityIcon } from 'lucide-react';
import { services } from '../../data/system';
import { Card, CardHeader } from '../ui/Card';
import { Badge, StatusDot } from '../ui/Badge';
import { cn } from '../../utils/cn';

const LABELS = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Outage'
} as const;

export function SystemHealth() {
  const degraded = services.filter((s) => s.status !== 'operational');

  return (
    <Card>
      <CardHeader
        title="System health"
        description={
        degraded.length === 0 ?
        'All delivery paths nominal.' :
        `${degraded.length} service needs attention: ${degraded.map((s) => s.name).join(', ')}.`
        }
        action={
        <Badge tone={degraded.length === 0 ? 'success' : 'warning'}>
            <ActivityIcon className="h-3 w-3" />
            {degraded.length === 0 ? 'All systems go' : 'Partial degradation'}
          </Badge>
        } />
      
      <ul className="divide-y divide-line">
        {services.map((service) =>
        <li key={service.id} className="flex items-center gap-4 px-5 py-3.5">
            <StatusDot status={service.status} />
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-ink">{service.name}</p>
              <p className="text-[12px] text-subtle">{service.detail}</p>
            </div>
            <div className="text-right">
              <p
              className={cn(
                'text-[12.5px] font-semibold',
                service.status === 'operational' && 'text-success',
                service.status === 'degraded' && 'text-warning',
                service.status === 'down' && 'text-danger'
              )}>
              
                {LABELS[service.status]}
              </p>
              <p className="text-[11.5px] text-subtle">
                {service.uptime} · {service.latencyMs}ms
              </p>
            </div>
          </li>
        )}
      </ul>
    </Card>);

}