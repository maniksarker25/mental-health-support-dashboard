import type { AdminProfile, ServiceHealth } from '../types';

export const initialProfile: AdminProfile = {
  name: 'Dana Whitfield',
  email: 'dana@mhanonymous.org',
  role: 'Super Admin',
  phone: '+1 (415) 555-0142',
  timezone: 'America/Los_Angeles',
  initials: 'DW'
};

export const TIMEZONES = [
'America/Los_Angeles',
'America/Denver',
'America/Chicago',
'America/New_York',
'Europe/London',
'Europe/Berlin',
'Asia/Kolkata',
'Asia/Singapore'];


export const services: ServiceHealth[] = [
{
  id: 'svc-api',
  name: 'Dispatch API',
  detail: 'api.mhanonymous.org',
  status: 'operational',
  uptime: '99.98%',
  latencyMs: 84
},
{
  id: 'svc-sms',
  name: 'SMS gateway',
  detail: 'Twilio · US/CA shortcode',
  status: 'operational',
  uptime: '99.94%',
  latencyMs: 212
},
{
  id: 'svc-email',
  name: 'Email gateway',
  detail: 'SendGrid · transactional pool',
  status: 'degraded',
  uptime: '99.41%',
  latencyMs: 640
},
{
  id: 'svc-buffer',
  name: 'Memory buffer',
  detail: 'Volatile recipient store',
  status: 'operational',
  uptime: '100%',
  latencyMs: 3
}];