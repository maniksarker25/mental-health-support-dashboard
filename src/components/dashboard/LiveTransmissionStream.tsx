import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ClockIcon, MailIcon, MessageSquareIcon, TriangleAlertIcon } from 'lucide-react';
import { initialTransmissions, makeTransmission } from '../../data/transmissions';
import type { DeliveryStatus, Transmission } from '../../types';
import { Card, CardHeader } from '../ui/Card';
import { Badge, ToneBadge } from '../ui/Badge';
import { TableShell, Td, Th } from '../ui/Table';
import { TableSkeleton } from '../ui/Skeleton';
import { Switch } from '../ui/Field';
import { clockTime } from '../../utils/format';

const STATUS_META: Record<
  DeliveryStatus,
  {label: string;tone: 'success' | 'warning' | 'danger';icon: React.ReactNode;}> =
{
  delivered: { label: 'Delivered', tone: 'success', icon: <CheckIcon className="h-3 w-3" /> },
  queued: { label: 'Queued', tone: 'warning', icon: <ClockIcon className="h-3 w-3" /> },
  failed: { label: 'Failed', tone: 'danger', icon: <TriangleAlertIcon className="h-3 w-3" /> }
};

export function LiveTransmissionStream({ loading }: {loading: boolean;}) {
  const [rows, setRows] = useState<Transmission[]>(initialTransmissions);
  const [live, setLive] = useState(true);
  const liveRef = useRef(live);
  liveRef.current = live;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!liveRef.current) return;
      setRows((prev) => [makeTransmission(0), ...prev].slice(0, 14));
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <CardHeader
        title="Live anonymized transmission stream"
        description="Recipients are masked at the source. Nothing shown here is recoverable after dispatch."
        action={
        <div className="min-w-[190px]">
            <Switch
            checked={live}
            onChange={setLive}
            label={live ? 'Streaming' : 'Paused'}
            description={live ? 'New events every few seconds' : 'Resume to follow live traffic'} />
          
          </div>
        } />
      

      {loading ?
      <TableSkeleton rows={6} columns={5} /> :

      <TableShell>
          <thead>
            <tr>
              <Th>Masked recipient</Th>
              <Th>Channel</Th>
              <Th>Topic</Th>
              <Th>Dispatched</Th>
              <Th align="right">Status</Th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {rows.map((row) => {
              const status = STATUS_META[row.status];
              return (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
                  
                    <Td className="font-medium text-ink">
                      <span className="font-mono text-[12.5px]">{row.recipient}</span>
                    </Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px]">
                        {row.channel === 'sms' ?
                      <MessageSquareIcon className="h-3.5 w-3.5 text-primary" /> :

                      <MailIcon className="h-3.5 w-3.5 text-sky-text" />
                      }
                        {row.channel === 'sms' ? 'SMS' : 'Email'}
                      </span>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-2">
                        <ToneBadge tone={row.tone} />
                        <span className="text-[13px] text-ink">{row.topicTitle}</span>
                      </span>
                    </Td>
                    <Td className="font-mono text-[12px] text-subtle">{clockTime(row.sentAt)}</Td>
                    <Td align="right">
                      <Badge tone={status.tone}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </Td>
                  </motion.tr>);

            })}
            </AnimatePresence>
          </tbody>
        </TableShell>
      }
    </Card>);

}