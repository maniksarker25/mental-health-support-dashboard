import type { Kpi, TrendPoint, TrendRange } from '../types';

export const kpis: Kpi[] = [
{
  id: 'sent',
  label: 'Total packets sent',
  value: '14,820',
  delta: '+12.4%',
  direction: 'up',
  caption: 'vs. previous 7 days',
  icon: 'Send'
},
{
  id: 'topics',
  label: 'Active educational topics',
  value: '8',
  delta: '2 drafts',
  direction: 'flat',
  caption: '6 published, 2 in review',
  icon: 'Library'
},
{
  id: 'delivery',
  label: 'Delivery success rate',
  value: '99.6%',
  delta: '+0.3%',
  direction: 'up',
  caption: '61 retries, 8 hard failures',
  icon: 'CheckCircle2'
},
{
  id: 'reads',
  label: 'Article read-through rate',
  value: '78.2%',
  delta: '+4.1%',
  direction: 'up',
  caption: 'Median read time: 3m 12s',
  icon: 'BookOpen'
}];


function series(labels: string[], smsBase: number, emailBase: number, wobble: number): TrendPoint[] {
  return labels.map((label, i) => ({
    label,
    sms: Math.round(smsBase + Math.sin(i / 1.7) * wobble + i * (smsBase / 60)),
    email: Math.round(emailBase + Math.cos(i / 2.1) * (wobble * 0.7) + i * (emailBase / 70))
  }));
}

export const dispatchTrends: Record<TrendRange, TrendPoint[]> = {
  '7d': series(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], 1180, 760, 190),
  '30d': series(
    Array.from({ length: 15 }, (_, i) => `${i * 2 + 1}`),
    1090,
    720,
    240
  ),
  '90d': series(
    ['Jun 1', 'Jun 15', 'Jul 1', 'Jul 15', 'Aug 1', 'Aug 15', 'Sep 1', 'Sep 15', 'Oct 1', 'Oct 15', 'Nov 1', 'Nov 15'],
    960,
    610,
    280
  ),
  '1y': series(
    ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    820,
    480,
    320
  )
};

export const RANGE_LABELS: Record<TrendRange, string> = {
  '7d': '7 days',
  '30d': '30 days',
  '90d': '90 days',
  '1y': '1 year'
};

export interface HeatCell {
  hour: number;
  day: string;
  value: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const heatmap: HeatCell[] = DAYS.flatMap((day, d) =>
Array.from({ length: 24 }, (_, hour) => {
  const evening = Math.exp(-Math.pow(hour - 22.5, 2) / 14);
  const lateNight = Math.exp(-Math.pow(hour - 1.5, 2) / 8) * 0.72;
  const morning = Math.exp(-Math.pow(hour - 8, 2) / 10) * 0.45;
  const weekend = day === 'Sat' || day === 'Sun' ? 1.18 : 1;
  const drift = 0.9 + (d * 7 + hour * 3) % 11 / 50;
  return {
    day,
    hour,
    value: Math.round((evening + lateNight + morning) * 120 * weekend * drift)
  };
})
);

export const heatmapDays = DAYS;