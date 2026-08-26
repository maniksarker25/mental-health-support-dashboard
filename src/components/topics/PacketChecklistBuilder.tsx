import React, { useState } from 'react';
import { ArrowDownIcon, ArrowUpIcon, GripVerticalIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { PacketItem } from '../../types';
import { Button } from '../ui/Button';
import { Input, Label } from '../ui/Field';
import { Tooltip } from '../ui/Tooltip';

export function PacketChecklistBuilder({
  items,
  onChange



}: {items: PacketItem[];onChange: (items: PacketItem[]) => void;}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const label = draft.trim();
    if (!label) return;
    onChange([...items, { id: `pi-${Math.random().toString(36).slice(2, 9)}`, label }]);
    setDraft('');
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [row] = next.splice(index, 1);
    next.splice(target, 0, row);
    onChange(next);
  };

  return (
    <div>
      <Label hint={`${items.length} items`}>Packet checklist</Label>
      <ul className="space-y-1.5">
        {items.map((item, index) =>
        <li
          key={item.id}
          className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5">
          
            <GripVerticalIcon className="h-4 w-4 shrink-0 text-subtle" aria-hidden="true" />
            <span className="w-5 shrink-0 text-center text-[11.5px] font-semibold text-subtle">
              {index + 1}
            </span>
            <input
            value={item.label}
            onChange={(e) =>
            onChange(items.map((i) => i.id === item.id ? { ...i, label: e.target.value } : i))
            }
            aria-label={`Checklist item ${index + 1}`}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-subtle" />
          
            <div className="flex shrink-0 items-center">
              <Tooltip label="Move up">
                <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move item ${index + 1} up`}
                className="rounded p-1 text-subtle transition-colors duration-150 ease-calm hover:bg-canvas hover:text-ink disabled:opacity-30">
                
                  <ArrowUpIcon className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
              <Tooltip label="Move down">
                <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Move item ${index + 1} down`}
                className="rounded p-1 text-subtle transition-colors duration-150 ease-calm hover:bg-canvas hover:text-ink disabled:opacity-30">
                
                  <ArrowDownIcon className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
              <Tooltip label="Remove">
                <button
                type="button"
                onClick={() => onChange(items.filter((i) => i.id !== item.id))}
                aria-label={`Remove item ${index + 1}`}
                className="rounded p-1 text-subtle transition-colors duration-150 ease-calm hover:bg-danger-bg hover:text-danger">
                
                  <Trash2Icon className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
            </div>
          </li>
        )}
        {items.length === 0 ?
        <li className="rounded-lg border border-dashed border-line px-3 py-5 text-center text-[12.5px] text-subtle">
            No items yet. Packets read best with four to six.
          </li> :
        null}
      </ul>

      <div className="mt-2 flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. Grounding techniques to try today"
          aria-label="New checklist item" />
        
        <Button variant="secondary" onClick={add} className="shrink-0">
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>
    </div>);

}