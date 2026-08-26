import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SaveIcon, ShieldCheckIcon, ExternalLinkIcon, EyeIcon } from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { Card, SectionTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { JoditRichText } from '../components/ui/JoditRichText';
import { dateTime } from '../utils/format';

export function PrivacyPolicyPage() {
  const { legalDocs, saveLegalDoc } = useAdminStore();
  const doc = useMemo(() => legalDocs.find((d) => d.id === 'privacy') || legalDocs[0], [legalDocs]);
  const [draftHtml, setDraftHtml] = useState<string>(doc.html);

  useEffect(() => {
    setDraftHtml(doc.html);
  }, [doc]);

  const dirty = draftHtml !== doc.html;

  const publish = () => {
    saveLegalDoc('privacy', draftHtml);
    toast.success('Privacy policy published to mobile app & web');
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Privacy Policy & Zero-Retention Architecture"
        description="Our clinical privacy protocol guarantees zero personal data retention. This policy is rendered verbatim inside the mobile app and receiver web portals."
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheckIcon className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">Privacy Policy Document</h3>
              <p className="text-xs text-body">{doc.description}</p>
            </div>
          </div>
          <Badge tone={dirty ? 'warning' : 'neutral'}>
            {dirty ? 'Unpublished edits' : `Last updated ${dateTime(doc.updatedAt)}`}
          </Badge>
        </div>

        <JoditRichText
          value={draftHtml}
          height={460}
          placeholder="Draft the privacy policy..."
          onChange={setDraftHtml}
        />

        <p className="text-[11.5px] text-subtle">
          Jodit output is sanitized semantic HTML, compatible with mobile app renderers.
        </p>
      </div>

      <Card className="px-5 py-4">
        <p className="text-[12.5px] leading-relaxed text-body">
          <span className="font-medium text-ink">Zero-Telemetry Guarantee:</span> We do not store phone numbers, IP addresses, or device identifiers upon resource dispatch. All ephemeral memory buffers are purged within 3 seconds of network delivery.
        </p>
      </Card>
    </div>
  );
}
