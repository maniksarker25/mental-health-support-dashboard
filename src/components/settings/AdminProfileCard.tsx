import React, { useState } from 'react';
import { toast } from 'sonner';
import { ShieldCheckIcon } from 'lucide-react';
import { useAdminStore } from '../../contexts/AdminStore';
import { TIMEZONES } from '../../data/system';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input, Label, Select } from '../ui/Field';

export function AdminProfileCard() {
  const { profile, saveProfile } = useAdminStore();
  const [form, setForm] = useState(profile);
  const [error, setError] = useState<string | null>(null);

  const dirty =
  form.name !== profile.name ||
  form.email !== profile.email ||
  form.phone !== profile.phone ||
  form.timezone !== profile.timezone;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setError('Enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    saveProfile(form);
    toast.success('Admin profile updated');
  };

  return (
    <Card>
      <CardHeader
        title="Admin information"
        description="Used for sign-in and for the signature on outbound replies."
        action={
          <div className="flex items-center gap-2">
            <Badge tone="primary">
              <ShieldCheckIcon className="h-3 w-3" />
              {profile.role}
            </Badge>
          </div>
        } />
      

      <form onSubmit={submit} className="space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-[15px] font-semibold text-primary">
            {profile.initials}
          </span>
          <div>
            <p className="text-[14px] font-medium text-ink">{profile.name}</p>
            <p className="text-[12.5px] text-body">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            
          </div>
          <div>
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            
          </div>
          <div>
            <Label htmlFor="profile-phone">Recovery phone</Label>
            <Input
              id="profile-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            
          </div>
          <div>
            <Label htmlFor="profile-tz">Timezone</Label>
            <Select
              id="profile-tz"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}>
              
              {TIMEZONES.map((tz) =>
              <option key={tz} value={tz}>
                  {tz.replace('_', ' ')}
                </option>
              )}
            </Select>
          </div>
        </div>

        {error ? <p className="text-[12px] text-danger">{error}</p> : null}

        <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-[11.5px] text-subtle">
            Role changes require a second Super Admin approval.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(profile);
                setError(null);
              }}
              disabled={!dirty}>
              
              Reset
            </Button>
            <Button type="submit" disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </Card>);

}