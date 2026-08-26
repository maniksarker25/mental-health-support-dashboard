import React from 'react';
import { ICON_CHOICES } from '../../data/topics';
import { DynamicIcon } from '../ui/DynamicIcon';
import { Tooltip } from '../ui/Tooltip';
import { cn } from '../../utils/cn';

export function IconPicker({
  value,
  onChange



}: {value: string;onChange: (icon: string) => void;}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Topic icon">
      {ICON_CHOICES.map((icon) => {
        const active = icon === value;
        return (
          <Tooltip key={icon} label={icon}>
            <button
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={icon}
              onClick={() => onChange(icon)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-150 ease-calm',
                active ?
                'border-primary bg-primary-tint text-primary' :
                'border-line bg-surface text-body hover:border-primary/40 hover:text-ink'
              )}>
              
              <DynamicIcon name={icon} className="h-4 w-4" />
            </button>
          </Tooltip>);

      })}
    </div>);

}