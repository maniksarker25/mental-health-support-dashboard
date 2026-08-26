import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CircleCheckIcon, SendIcon } from 'lucide-react';
import { TONE_META } from '../../data/topics';
import type { Topic } from '../../types';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SegmentedControl } from '../ui/Field';
import { cn } from '../../utils/cn';

type View = 'card' | 'detail' | 'article';

function readMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function MobileSimulator({ topic, className }: {topic: Topic;className?: string;}) {
  const [view, setView] = useState<View>('card');
  const tone = TONE_META[topic.tone];

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <SegmentedControl<View>
        ariaLabel="Mobile preview screen"
        value={view}
        onChange={setView}
        options={[
        { value: 'card', label: 'List' },
        { value: 'detail', label: 'Packet' },
        { value: 'article', label: 'Article' }]
        } />
      

      <div className="w-[300px] rounded-[38px] border-[9px] border-[#1c2622] bg-[#1c2622] shadow-pop">
        <div className="relative overflow-hidden rounded-[30px] bg-canvas">
          <div className="flex items-center justify-between px-5 pb-1 pt-3 text-[10.5px] font-semibold text-ink">
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-[#1c2622]" />
            <span>100%</span>
          </div>

          {view === 'card' ?
          <div className="h-[498px] overflow-hidden px-4 pb-4">
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">
                Send anonymously
              </p>
              <h2 className="mt-1 font-display text-[21px] font-medium leading-tight text-ink">
                What do they need help understanding?
              </h2>

              <div
              className={cn('mt-4 rounded-2xl border p-4 shadow-sm ring-2 ring-primary/25', tone.chip)}>
              
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-surface/70">
                    <DynamicIcon name={topic.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-tight">
                      {topic.title || 'Untitled topic'}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-snug opacity-90">
                      {topic.subtitle || 'Add a one-line subtitle to orient the reader.'}
                    </p>
                  </div>
                  <ChevronRightIcon className="ml-auto mt-1 h-4 w-4 shrink-0 opacity-60" />
                </div>
                <p className="mt-3 border-t border-black/10 pt-2.5 text-[11.5px] font-medium">
                  {topic.items.length} resources · {readMinutes(topic.article)} min article
                </p>
              </div>

              <div className="mt-3 space-y-2 opacity-40">
                {['Depression', 'Stress & Burnout', 'Grief & Loss'].map((label) =>
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
                
                    <span className="h-7 w-7 rounded-lg bg-canvas" />
                    <span className="text-[13.5px] font-medium text-ink">{label}</span>
                  </div>
              )}
              </div>
            </div> :
          view === 'detail' ?
          <div className="mha-scroll h-[498px] overflow-y-auto px-4 pb-5">
              <button className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-primary">
                <ChevronLeftIcon className="h-3.5 w-3.5" /> Topics
              </button>

              <div className={cn('mt-3 rounded-2xl border p-4', tone.chip)}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/10 bg-surface/70">
                  <DynamicIcon name={topic.icon} className="h-[18px] w-[18px]" />
                </span>
                <h2 className="mt-3 font-display text-[19px] font-medium leading-tight">
                  {topic.packetTitle || topic.title || 'Untitled packet'}
                </h2>
                <p className="mt-1.5 text-[12.5px] leading-relaxed opacity-90">
                  {topic.intro || 'Add intro text so the recipient knows what they are opening.'}
                </p>
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">
                In this packet
              </p>
              <ul className="mt-2 space-y-1.5">
                {topic.items.length === 0 ?
              <li className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-[12px] text-subtle">
                    No checklist items yet
                  </li> :

              topic.items.map((item) =>
              <li
                key={item.id}
                className="flex items-start gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
                
                      <CircleCheckIcon className="mt-[1px] h-4 w-4 shrink-0 text-primary" />
                      <span className="text-[12.5px] leading-snug text-ink">{item.label}</span>
                    </li>
              )
              }
              </ul>

              {topic.rationale ?
            <div className="mt-4 rounded-xl bg-primary-tint px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.09em] text-primary">
                    Why this helps
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-primary">{topic.rationale}</p>
                </div> :
            null}

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[13.5px] font-semibold text-primary-fg">
                <SendIcon className="h-4 w-4" />
                Send anonymously
              </button>
              <p className="mt-2 text-center text-[10.5px] text-subtle">
                Your name and number are never shared.
              </p>
            </div> :

          <div className="mha-scroll h-[498px] overflow-y-auto px-4 pb-6">
              <button className="mt-2 flex items-center gap-1 text-[12.5px] font-medium text-primary">
                <ChevronLeftIcon className="h-3.5 w-3.5" /> Packet
              </button>

              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-subtle">
                {readMinutes(topic.article)} min read · sent anonymously
              </p>
              <h1 className="mt-1 font-display text-[20px] font-medium leading-snug text-ink">
                {topic.packetTitle || topic.title || 'Untitled article'}
              </h1>
              <div className={cn('mt-3 h-1 w-10 rounded-full border', tone.swatch)} />

              {topic.article.trim().length === 0 ?
            <p className="mt-6 rounded-xl border border-dashed border-line px-3 py-6 text-center text-[12px] text-subtle">
                  Write the article in the editor to preview it here.
                </p> :

            <div
              className="mha-prose mt-4 text-[13px]"
              dangerouslySetInnerHTML={{ __html: topic.article }} />

            }
            </div>
          }
        </div>
      </div>

      <p className="max-w-[300px] text-center text-[11.5px] text-subtle">
        Live simulator — reflects the mobile app exactly as you type.
      </p>
    </div>);

}