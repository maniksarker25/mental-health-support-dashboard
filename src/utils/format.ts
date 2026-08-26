import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function relativeTime(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true });
}

export function shortDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy');
}

export function clockTime(iso: string): string {
  return format(parseISO(iso), 'h:mm:ss a');
}

export function dateTime(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy 'at' h:mm a");
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export function fullNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function maskPhone(last4: string): string {
  return `+1 (•••) •••-${last4}`;
}

export function maskEmail(firstChar: string, tld: string): string {
  return `${firstChar}***@***.${tld}`;
}