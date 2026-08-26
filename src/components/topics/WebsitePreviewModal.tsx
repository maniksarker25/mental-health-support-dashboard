import React, { useState } from 'react';
import {
  LaptopIcon,
  TabletIcon,
  SmartphoneIcon,
  CopyIcon,
  ExternalLinkIcon,
  XIcon,
  RefreshCwIcon,
  LockIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import type { TopicAndResource } from '../../types';
import { ResourceWebsiteRenderer } from '../public/ResourceWebsiteRenderer';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface WebsitePreviewModalProps {
  open: boolean;
  resource: TopicAndResource | null;
  onClose: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function WebsitePreviewModal({ open, resource, onClose }: WebsitePreviewModalProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState(0);

  if (!open || !resource) return null;

  const publicUrl = `${window.location.origin}/resource/${resource.slug || resource.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success('Public receiver link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md transition-opacity">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-900/90 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold sm:text-base">
            Website Preview: <span className="text-primary-tint">{resource.topicTitle || resource.title}</span>
          </span>
          <span className="hidden rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] text-slate-300 sm:inline-block">
            /{resource.slug}
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-white/10">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              device === 'desktop' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            <LaptopIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Laptop / Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('tablet')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              device === 'tablet' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            <TabletIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              device === 'mobile' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
            )}
          >
            <SmartphoneIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Mobile Phone</span>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={handleCopyLink}>
            <CopyIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Copy Receiver Link</span>
          </Button>
          <a
            href={`/resource/${resource.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            <ExternalLinkIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open in Tab</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Screen Frame Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        {device === 'desktop' && (
          <div className="w-full max-w-5xl h-[84vh] flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-canvas shadow-2xl transition-all duration-200">
            {/* Realistic Browser Top Mockup */}
            <div className="flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-1 text-xs text-subtle border border-line w-full max-w-md">
                  <LockIcon className="h-3 w-3 text-emerald-500" />
                  <span className="font-mono text-[11px] truncate">https://support.mentalhealth.org/resource/{resource.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setKey((k) => k + 1)}
                className="rounded p-1 text-subtle hover:text-ink"
                title="Refresh preview"
              >
                <RefreshCwIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Render Public Web Page */}
            <div className="flex-1 overflow-y-auto">
              <ResourceWebsiteRenderer key={key} resource={resource} />
            </div>
          </div>
        )}

        {device === 'tablet' && (
          <div className="w-[768px] max-w-full h-[84vh] flex flex-col overflow-hidden rounded-3xl border-[8px] border-slate-800 bg-canvas shadow-2xl transition-all duration-200">
            <div className="flex items-center justify-center border-b border-line bg-surface px-4 py-2 text-xs text-subtle font-mono">
              <span>Tablet View (768px)</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ResourceWebsiteRenderer key={key} resource={resource} />
            </div>
          </div>
        )}

        {device === 'mobile' && (
          <div className="w-[390px] max-w-full h-[84vh] flex flex-col overflow-hidden rounded-[42px] border-[10px] border-slate-900 bg-canvas shadow-2xl transition-all duration-200">
            {/* Phone Notch */}
            <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-ink bg-surface border-b border-line/40">
              <span>9:41</span>
              <span className="h-4 w-20 rounded-full bg-slate-900" />
              <span>100%</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ResourceWebsiteRenderer key={key} resource={resource} isMobilePreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
