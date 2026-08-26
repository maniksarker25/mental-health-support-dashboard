import React from 'react';
import { KpiRow } from '../components/dashboard/KpiRow';
import { DispatchTrendChart } from '../components/dashboard/DispatchTrendChart';
import { TopicDemandChart } from '../components/dashboard/TopicDemandChart';
import { LiveTransmissionStream } from '../components/dashboard/LiveTransmissionStream';
import { useSimulatedLoad } from '../hooks/useTableState';

export function DashboardPage() {
  const loading = useSimulatedLoad(700);

  return (
    <div className="space-y-6">
      <KpiRow loading={loading} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DispatchTrendChart loading={loading} />
        </div>
        <TopicDemandChart loading={loading} />
      </div>

      <LiveTransmissionStream loading={loading} />
    </div>
  );
}