import type { Channel, DeliveryStatus, ToneKey, Transmission } from '../types';

interface Seed {
  topicTitle: string;
  tone: ToneKey;
}

const SEEDS: Seed[] = [
{ topicTitle: 'Anxiety', tone: 'sky' },
{ topicTitle: 'Depression', tone: 'lavender' },
{ topicTitle: 'Stress & Burnout', tone: 'sand' },
{ topicTitle: 'Grief & Loss', tone: 'blush' },
{ topicTitle: 'Trauma & PTSD', tone: 'lavender' },
{ topicTitle: 'Substance Use', tone: 'mist' },
{ topicTitle: 'Dementia & Caregiving', tone: 'mist' },
{ topicTitle: 'Eating Disorders', tone: 'sky' }];


const LAST4 = ['4321', '9087', '2214', '6650', '1173', '8802', '5539', '3096', '7748', '0412'];
const EMAIL_FIRST = ['m', 'j', 'a', 's', 'r', 'k', 'd', 't', 'l', 'n'];
const TLDS = ['com', 'org', 'net', 'edu'];

let counter = 0;

function pick<T>(arr: T[], n: number): T {
  return arr[n % arr.length];
}

export function makeTransmission(offsetSeconds = 0): Transmission {
  const n = counter++;
  const channel: Channel = n % 5 === 0 || n % 5 === 3 ? 'email' : 'sms';
  const seed = pick(SEEDS, n * 3 + 1);
  const statusRoll = n * 7 % 23;
  const status: DeliveryStatus = statusRoll === 4 ? 'queued' : statusRoll === 11 ? 'failed' : 'delivered';
  return {
    id: `tx-${Date.now()}-${n}`,
    recipient:
    channel === 'sms' ?
    `+1 (•••) •••-${pick(LAST4, n * 3)}` :
    `${pick(EMAIL_FIRST, n * 5)}***@***.${pick(TLDS, n)}`,
    channel,
    topicTitle: seed.topicTitle,
    tone: seed.tone,
    status,
    sentAt: new Date(Date.now() - offsetSeconds * 1000).toISOString()
  };
}

export const initialTransmissions: Transmission[] = Array.from({ length: 12 }, (_, i) =>
makeTransmission(i * 47 + 6)
);