import React, { useEffect, useState } from 'react';
import { DatabaseIcon, HardDriveIcon, ShieldCheckIcon, TimerResetIcon } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface PurgeEvent {
  id: number;
  bytes: number;
  at: string;
}

export function ComplianceMonitor() {
  const [events, setEvents] = useState<PurgeEvent[]>([]);
  const [buffer, setBuffer] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setBuffer(Math.floor(Math.random() * 7) + 1);
      setEvents((prev) =>
      [
      {
        id: Date.now(),
        bytes: (Math.floor(Math.random() * 9) + 2) * 128,
        at: new Date().toLocaleTimeString('en-US', { hour12: false })
      },
      ...prev].
      slice(0, 5)
      );
    }, 3600);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
  {
    id: 'disk',
    label: 'Recipient data on disk',
    value: '0 bytes',
    detail: 'Verified by the nightly integrity sweep',
    icon: HardDriveIcon
  },
  {
    id: 'buffer',
    label: 'Volatile buffer',
    value: `${buffer} record${buffer === 1 ? '' : 's'}`,
    detail: 'In flight right now, purged within 3s',
    icon: DatabaseIcon
  },
  {
    id: 'purge',
    label: 'Mean purge latency',
    value: '2.4s',
    detail: 'Target is under 5s after gateway ack',
    icon: TimerResetIcon
  }];


  return (
    <Card>
      <CardHeader
        title="Zero-retention compliance monitor"
        description="Live evidence that nothing identifying survives a dispatch."
        action={
        <Badge tone="success">
            <ShieldCheckIcon className="h-3 w-3" />
            Compliant
          </Badge>
        } />
      
      <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {metrics.map(({ id, label, value, detail, icon: Icon }) =>
        <div key={id} className="px-5 py-4">
            <div className="flex items-center gap-2 text-body">
              <Icon className="h-3.5 w-3.5" />
              <p className="text-[12.5px] font-medium">{label}</p>
            </div>
            <p className="mt-2 font-display text-[24px] font-medium leading-none text-ink">{value}</p>
            <p className="mt-1.5 text-[11.5px] text-subtle">{detail}</p>
          </div>
        )}
      </div>
      <div className="border-t border-line px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-subtle">
          Recent purge log
        </p>
        <ul className="mt-2 space-y-1">
          {events.length === 0 ?
          <li className="text-[12.5px] text-body">Listening for dispatch events…</li> :

          events.map((event) =>
          <li key={event.id} className="flex items-center gap-3 font-mono text-[12px] text-body">
                <span className="text-subtle">{event.at}</span>
                <span>purged {event.bytes} bytes from memory buffer</span>
                <span className="ml-auto text-success">ok</span>
              </li>
          )
          }
        </ul>
      </div>
    </Card>);

}