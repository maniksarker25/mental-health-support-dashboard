import React, { useState } from 'react';
import { toast } from 'sonner';
import { CheckIcon, PhoneIcon, PencilIcon, XIcon, PlusIcon, Trash2Icon, ShieldAlertIcon } from 'lucide-react';
import { useAdminStore } from '../../contexts/AdminStore';
import type { Hotline } from '../../types';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Field';

export function HotlineEditor() {
  const { hotlines, saveHotline } = useAdminStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Hotline | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newHotline, setNewHotline] = useState<Partial<Hotline>>({
    name: '',
    number: '',
    description: '',
    availability: 'Available 24/7',
  });

  const startEdit = (hotline: Hotline) => {
    setEditingId(hotline.id);
    setDraft({ ...hotline });
    setIsAddingNew(false);
  };

  const commit = () => {
    if (!draft) return;
    if (!draft.name || draft.name.trim().length < 2) {
      toast.error('Hotline name is required.');
      return;
    }
    if (draft.number.trim().length < 3) {
      toast.error('A hotline needs a valid dial number.');
      return;
    }
    saveHotline(draft);
    toast.success(`“${draft.name}” updated successfully.`);
    setEditingId(null);
    setDraft(null);
  };

  const handleAddNew = () => {
    if (!newHotline.name || newHotline.name.trim().length < 2) {
      toast.error('Hotline name is required.');
      return;
    }
    if (!newHotline.number || newHotline.number.trim().length < 3) {
      toast.error('A hotline needs a valid dial number.');
      return;
    }

    const created: Hotline = {
      id: `hl-${Date.now()}`,
      name: newHotline.name,
      number: newHotline.number,
      description: newHotline.description || 'Emergency crisis counseling.',
      availability: newHotline.availability || 'Available 24/7',
    };

    saveHotline(created);
    toast.success(`“${created.name}” added to global crisis directories.`);
    setIsAddingNew(false);
    setNewHotline({
      name: '',
      number: '',
      description: '',
      availability: 'Available 24/7',
    });
  };

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink flex items-center gap-2">
            <ShieldAlertIcon className="h-4 w-4 text-rose-500" />
            Emergency Hotline Quick-Updater
          </h3>
          <p className="mt-0.5 text-xs text-subtle">
            These numbers appear on the crisis screen, emergency banners, and in every packet footer.
          </p>
        </div>

        {!isAddingNew && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setIsAddingNew(true);
              setEditingId(null);
              setDraft(null);
            }}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Add Hotline
          </Button>
        )}
      </div>

      {/* Add New Hotline Form */}
      {isAddingNew && (
        <div className="border-b border-line bg-surface/80 p-5 space-y-3">
          <h4 className="text-xs font-semibold text-ink">Add New Crisis Helpline</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={newHotline.name || ''}
              onChange={(e) => setNewHotline({ ...newHotline, name: e.target.value })}
              placeholder="Helpline Name (e.g. Veterans Crisis Line)"
              className="text-xs"
            />
            <Input
              value={newHotline.number || ''}
              onChange={(e) => setNewHotline({ ...newHotline, number: e.target.value })}
              placeholder="Dial Number (e.g. 988, 1-800-273-8255)"
              className="text-xs font-mono"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={newHotline.description || ''}
              onChange={(e) => setNewHotline({ ...newHotline, description: e.target.value })}
              placeholder="Description / Audience (e.g. Free 24/7 Call & Text)"
              className="text-xs"
            />
            <Input
              value={newHotline.availability || ''}
              onChange={(e) => setNewHotline({ ...newHotline, availability: e.target.value })}
              placeholder="Availability (e.g. 24 hours / 7 days a week)"
              className="text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" size="sm" onClick={() => setIsAddingNew(false)}>
              <XIcon className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNew}>
              <CheckIcon className="h-3.5 w-3.5" />
              Save Hotline
            </Button>
          </div>
        </div>
      )}

      <ul className="divide-y divide-line">
        {hotlines.map((hotline) => {
          const editing = editingId === hotline.id && draft;
          return (
            <li key={hotline.id} className="px-5 py-3.5">
              {editing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_200px]">
                    <Input
                      value={draft!.name}
                      onChange={(e) => setDraft({ ...draft!, name: e.target.value })}
                      aria-label="Hotline name"
                      placeholder="Hotline name"
                      className="text-xs font-medium"
                    />
                    <Input
                      value={draft!.number}
                      onChange={(e) => setDraft({ ...draft!, number: e.target.value })}
                      aria-label="Hotline number"
                      placeholder="Number"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input
                      value={draft!.description}
                      onChange={(e) => setDraft({ ...draft!, description: e.target.value })}
                      aria-label="Hotline description"
                      placeholder="Description"
                      className="text-xs"
                    />
                    <Input
                      value={draft!.availability || ''}
                      onChange={(e) => setDraft({ ...draft!, availability: e.target.value })}
                      aria-label="Availability"
                      placeholder="Availability (e.g. 24/7)"
                      className="text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(null);
                        setDraft(null);
                      }}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={commit}>
                      <CheckIcon className="h-3.5 w-3.5" />
                      Save Number
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <PhoneIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="text-[13.5px] font-medium text-ink">{hotline.name}</p>
                      <span className="font-mono text-[13px] font-semibold text-rose-600 dark:text-rose-400">
                        {hotline.number}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-body">{hotline.description}</p>
                    <p className="mt-0.5 text-[11px] text-subtle font-mono">{hotline.availability}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => startEdit(hotline)}>
                    <PencilIcon className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}