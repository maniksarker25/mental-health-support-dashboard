import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SaveIcon, FileTextIcon, ScaleIcon } from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { Card, SectionTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { JoditRichText } from '../components/ui/JoditRichText';
import { dateTime } from '../utils/format';

export function TermsPage() {
  const { legalDocs, saveLegalDoc } = useAdminStore();
  const doc = useMemo(() => legalDocs.find((d) => d.id === 'terms') || legalDocs[0], [legalDocs]);
  const [draftHtml, setDraftHtml] = useState<string>(doc.html);

  useEffect(() => {
    setDraftHtml(doc.html);
  }, [doc]);

  const dirty = draftHtml !== doc.html;

  const publish = () => {
    saveLegalDoc('terms', draftHtml);
    toast.success('Terms of Service published to mobile app & web');
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Terms of Service & Clinical Boundary Agreement"
        description="Defines educational boundaries, emergency limitations, and non-medical liability agreements governing all distributed resources."
        action={
          <div className="flex items-center gap-2">
            <Button onClick={publish} disabled={!dirty}>
              <SaveIcon className="h-4 w-4" />
              {dirty ? 'Publish Changes' : 'Up to Date'}
            </Button>
          </div>
        }
      />

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <ScaleIcon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">Terms of Service Document</h3>
              <p className="text-xs text-body">{doc.description}</p>
            </div>
          </div>
          <Badge tone={dirty ? 'warning' : 'neutral'}>
            {dirty ? 'Unpublished edits' : `Last updated ${dateTime(doc.updatedAt)}`}
          </Badge>
        </div>

        <JoditRichText
          value={draftHtml}
          height={480}
          placeholder="Draft the terms of service..."
          onChange={setDraftHtml}
        />

        <p className="text-[11.5px] text-subtle">
          Jodit output is sanitized semantic HTML, compatible with mobile app renderers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
            <FileTextIcon className="h-4 w-4 text-primary" />
            Educational Non-Medical Notice
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-body">
            All packets and content sent via this platform are educational materials designed to support communication and do not constitute doctor-patient relationships or formal psychiatric diagnoses.
          </p>
        </Card>

        <Card className="p-5">
          <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
            <ScaleIcon className="h-4 w-4 text-primary" />
            Legal Review Cadence
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-body">
            Terms of Service are reviewed quarterly by healthcare compliance counsel to align with evolving digital health regulations and state telehealth boundaries.
          </p>
        </Card>
      </div>
    </div>
  );
}
