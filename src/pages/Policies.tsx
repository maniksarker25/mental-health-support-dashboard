import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SaveIcon } from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { LegalDocId } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { JoditRichText } from '../components/ui/JoditRichText';
import { HotlineEditor } from '../components/legal/HotlineEditor';
import { dateTime } from '../utils/format';
import { cn } from '../utils/cn';

export function PoliciesPage() {
  const { legalDocs, saveLegalDoc } = useAdminStore();
  const [activeId, setActiveId] = useState<LegalDocId>('privacy');
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const active = useMemo(
    () => legalDocs.find((d) => d.id === activeId) ?? legalDocs[0],
    [legalDocs, activeId]
  );

  useEffect(() => {
    setDrafts((prev) => prev[active.id] === undefined ? { ...prev, [active.id]: active.html } : prev);
  }, [active]);

  const html = drafts[active.id] ?? active.html;
  const dirty = html !== active.html;

  const publish = () => {
    saveLegalDoc(active.id, html);
    toast.success(`${active.label} published to the mobile app`);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Policies & FAQ"
        description="These documents are rendered verbatim inside the mobile app. Semantic HTML only — no scripts, no external assets."
        action={
          <div className="flex items-center gap-2">
            <Button onClick={publish} disabled={!dirty}>
              <SaveIcon className="h-4 w-4" />
              {dirty ? 'Publish changes' : 'Up to date'}
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Policy documents">
        {legalDocs.map((doc) => {
          const isActive = doc.id === active.id;
          const isDirty = drafts[doc.id] !== undefined && drafts[doc.id] !== doc.html;
          return (
            <button
              key={doc.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(doc.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors duration-150 ease-calm',
                isActive ?
                'border-primary/30 bg-primary-tint text-primary' :
                'border-line bg-surface text-body hover:text-ink'
              )}>
              
              {doc.label}
              {isDirty ? <span className="h-1.5 w-1.5 rounded-full bg-warning" /> : null}
            </button>);

        })}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-ink">{active.label}</h3>
            <p className="mt-0.5 text-[12.5px] text-body">{active.description}</p>
          </div>
          <Badge tone={dirty ? 'warning' : 'neutral'}>
            {dirty ? 'Unpublished edits' : `Last updated ${dateTime(active.updatedAt)}`}
          </Badge>
        </div>

        <JoditRichText
          key={active.id}
          value={html}
          height={460}
          placeholder={`Write the ${active.label.toLowerCase()}…`}
          onChange={(next) => setDrafts((prev) => ({ ...prev, [active.id]: next }))} />
        

        <p className="text-[11.5px] text-subtle">
          Jodit output is sanitized semantic HTML, compatible with the app&apos;s{' '}
          <span className="font-mono">react-native-render-html</span> renderer.
        </p>
      </div>

      <HotlineEditor />

      <Card className="px-5 py-4">
        <p className="text-[12.5px] leading-relaxed text-body">
          <span className="font-medium text-ink">Review cadence.</span> Crisis helplines are verified
          weekly against national directories; privacy and terms are reviewed by counsel each quarter.
          Publishing here takes effect on the next app launch — there is no client cache to bust.
        </p>
      </Card>
    </div>);

}