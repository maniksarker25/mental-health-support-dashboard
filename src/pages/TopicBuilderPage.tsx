import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeftIcon,
  SaveIcon,
  LaptopIcon,
  TabletIcon,
  SmartphoneIcon,
  LockIcon,
  CopyIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  CheckIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import {
  TONE_KEYS,
  TONE_META,
} from '../data/topics';
import type {
  TopicAndResource,
  ToneKey,
} from '../types';
import { Button } from '../components/ui/Button';
import { Input, Label, SegmentedControl, Switch, Textarea, Select } from '../components/ui/Field';
import { IconPicker } from '../components/topics/IconPicker';
import { SectionListBuilder } from '../components/topics/SectionListBuilder';
import { ResourceWebsiteRenderer } from '../components/public/ResourceWebsiteRenderer';
import { emptyTopic } from '../components/topics/TopicEditorSheet';
import { cn } from '../utils/cn';

type Tab = 'basic' | 'sections' | 'safety' | 'seo';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

interface Errors {
  topicTitle?: string;
  resourceTitle?: string;
}

export function TopicBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { topics, saveTopic } = useAdminStore();

  const isEditing = Boolean(id);
  const existingTopic = useMemoTopic(topics, id);

  const [draft, setDraft] = useState<TopicAndResource>(() => existingTopic || emptyTopic());
  const [tab, setTab] = useState<Tab>('basic');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingTopic) {
      setDraft({
        ...existingTopic,
        topicTitle: existingTopic.topicTitle || existingTopic.title || '',
        resourceTitle: existingTopic.resourceTitle || existingTopic.packetTitle || existingTopic.title || '',
        sections: existingTopic.sections && existingTopic.sections.length > 0 ? existingTopic.sections : emptyTopic().sections,
        safety: existingTopic.safety || emptyTopic().safety,
        review: existingTopic.review || emptyTopic().review,
        seo: existingTopic.seo || emptyTopic().seo,
      });
    }
  }, [existingTopic]);

  const patch = (values: Partial<TopicAndResource>) => {
    setDraft((prev) => {
      const updated = { ...prev, ...values };
      if (values.topicTitle !== undefined) updated.title = values.topicTitle;
      if (values.resourceTitle !== undefined) updated.packetTitle = values.resourceTitle;
      if (values.shortDescription !== undefined) updated.subtitle = values.shortDescription;
      return updated;
    });
  };

  const handleTopicTitleChange = (val: string) => {
    patch({
      topicTitle: val,
      resourceTitle: draft.resourceTitle || val,
    });
  };

  const validateDraft = (): boolean => {
    const errs: Errors = {};
    if (!draft.topicTitle || draft.topicTitle.trim().length < 2) {
      errs.topicTitle = 'Topic name is required.';
    }
    if (!draft.resourceTitle || draft.resourceTitle.trim().length < 3) {
      errs.resourceTitle = 'Website headline is required.';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTab('basic');
      toast.error('Please complete the highlighted fields before saving.');
      return false;
    }
    return true;
  };

  const handleSave = (publish: boolean) => {
    if (!validateDraft()) return;

    setSaving(true);
    const toSave: TopicAndResource = {
      ...draft,
      title: draft.topicTitle,
      packetTitle: draft.resourceTitle,
      subtitle: draft.shortDescription || draft.subtitle || '',
      status: publish ? 'published' : 'draft',
      isPublished: publish,
    };

    setTimeout(() => {
      saveTopic(toSave);
      setSaving(false);
      toast.success(
        publish
          ? `“${toSave.topicTitle}” is now published and live!`
          : `“${toSave.topicTitle}” saved as draft.`
      );
      navigate('/topics');
    }, 350);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/resource/${draft.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Public receiver link copied to clipboard!');
  };

  const toneMeta = TONE_META[draft.tone] || TONE_META.sky;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-3.5 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/topics"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-canvas text-body hover:border-primary hover:text-primary transition-colors"
            title="Back to topics"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-ink sm:text-lg">
                {isEditing ? 'Edit Topic & Resource' : 'Create New Topic & Resource'}
              </span>
              <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', toneMeta.chip)}>
                {toneMeta.label}
              </span>
            </div>
            <p className="line-clamp-1 text-xs text-subtle">
              {draft.topicTitle ? `Topic: ${draft.topicTitle}` : 'Configure content on the left; live website updates on the right.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            title="Copy Public Link"
          >
            <CopyIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={saving}
            onClick={() => handleSave(false)}
          >
            <SaveIcon className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={() => handleSave(true)}
          >
            <CheckIcon className="h-3.5 w-3.5" />
            <span>{saving ? 'Publishing…' : 'Save & Publish Live'}</span>
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Content Editor + Right Live Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 flex-1 items-start">
        {/* LEFT COLUMN: Content Editor */}
        <div className="lg:col-span-6 xl:col-span-6 space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-sm space-y-5">
            {/* Editor Tabs */}
            <div className="border-b border-line pb-3">
              <SegmentedControl<Tab>
                ariaLabel="Editor section"
                value={tab}
                onChange={setTab}
                options={[
                  { value: 'basic', label: '1. Basic Info & Tone' },
                  { value: 'sections', label: `2. Sections (${(draft.sections || []).length})` },
                  { value: 'safety', label: '3. Safety & Review' },
                  { value: 'seo', label: '4. SEO & Share' },
                ]}
              />
            </div>

            {/* TAB 1: BASIC INFO */}
            {tab === 'basic' && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="b-topic-name">Topic Name (App Display)</Label>
                  <Input
                    id="b-topic-name"
                    value={draft.topicTitle}
                    onChange={(e) => handleTopicTitleChange(e.target.value)}
                    placeholder="e.g. Anxiety, Depression, Grief, Stress"
                    aria-invalid={Boolean(errors.topicTitle)}
                  />
                  {errors.topicTitle ? (
                    <p className="mt-1 text-xs text-danger">{errors.topicTitle}</p>
                  ) : null}
                  <p className="mt-1 text-[11.5px] text-subtle">
                    Appears on the mobile app screen for users to select.
                  </p>
                </div>

                <div>
                  <Label htmlFor="b-res-title">Resource Website Headline</Label>
                  <Input
                    id="b-res-title"
                    value={draft.resourceTitle}
                    onChange={(e) => patch({ resourceTitle: e.target.value })}
                    placeholder="e.g. Understanding Anxiety: A Gentle & Practical Guide"
                    aria-invalid={Boolean(errors.resourceTitle)}
                  />
                  {errors.resourceTitle ? (
                    <p className="mt-1 text-xs text-danger">{errors.resourceTitle}</p>
                  ) : null}
                  <p className="mt-1 text-[11.5px] text-subtle">
                    Rendered at the top of the recipient's webpage.
                  </p>
                </div>

                <div>
                  <Label htmlFor="b-short-desc">Short Subtitle / Description</Label>
                  <Textarea
                    id="b-short-desc"
                    rows={2}
                    value={draft.shortDescription || ''}
                    onChange={(e) => patch({ shortDescription: e.target.value })}
                    placeholder="For the person whose mind will not slow down and whose body is holding tension..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label hint="Sets the theme and color mood">Tone Palette</Label>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Tone preset">
                      {TONE_KEYS.map((toneKey: ToneKey) => {
                        const meta = TONE_META[toneKey];
                        const active = draft.tone === toneKey;
                        return (
                          <button
                            key={toneKey}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => patch({ tone: toneKey })}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all',
                              meta.chip,
                              active ? 'ring-2 ring-primary shadow-sm' : 'opacity-70 hover:opacity-100'
                            )}
                          >
                            <span className={cn('h-3 w-3 rounded-full border', meta.swatch)} />
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <Label>Topic Icon</Label>
                    <IconPicker value={draft.icon || 'Leaf'} onChange={(icon) => patch({ icon })} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="b-featured-img">Featured Image URL</Label>
                  <Input
                    id="b-featured-img"
                    value={draft.featuredImage}
                    onChange={(e) => patch({ featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="rounded-xl border border-line bg-surface p-4">
                  <Switch
                    checked={draft.status === 'published'}
                    onChange={(next) => patch({ status: next ? 'published' : 'draft', isPublished: next })}
                    label="Published to App & Web"
                    description={
                      draft.status === 'published'
                        ? 'Available to app senders and accessible via link.'
                        : 'Draft mode — visible only in the admin dashboard.'
                    }
                  />
                </div>
              </div>
            )}

            {/* TAB 2: MODULAR SECTIONS */}
            {tab === 'sections' && (
              <SectionListBuilder
                sections={draft.sections || []}
                onChange={(sections) => patch({ sections })}
              />
            )}

            {/* TAB 3: SAFETY & CLINICAL REVIEW */}
            {tab === 'safety' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
                    <ShieldCheckIcon className="h-4 w-4 text-primary" />
                    Crisis Information & Hotlines
                  </h4>

                  <Switch
                    checked={draft.safety?.hasCrisisInformation ?? true}
                    onChange={(checked) =>
                      patch({
                        safety: {
                          ...draft.safety,
                          hasCrisisInformation: checked,
                          disclaimer: draft.safety?.disclaimer || '',
                        },
                      })
                    }
                    label="Show Emergency 24/7 Crisis Bar"
                    description="Surfaces 988 and Crisis Text Line dial buttons prominently on the website."
                  />

                  <div>
                    <Label htmlFor="b-safety-disc">Clinical Disclaimer</Label>
                    <Textarea
                      id="b-safety-disc"
                      rows={3}
                      value={draft.safety?.disclaimer || ''}
                      onChange={(e) =>
                        patch({
                          safety: {
                            ...draft.safety,
                            hasCrisisInformation: draft.safety?.hasCrisisInformation ?? true,
                            disclaimer: e.target.value,
                          },
                        })
                      }
                      placeholder="Medical disclaimer..."
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
                  <h4 className="text-sm font-semibold text-ink">Clinical Review Sign-off</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <Label htmlFor="b-rev-status">Review Status</Label>
                      <Select
                        id="b-rev-status"
                        value={draft.review?.reviewStatus || 'pending'}
                        onChange={(e) =>
                          patch({
                            review: {
                              ...draft.review,
                              reviewStatus: e.target.value as any,
                            },
                          })
                        }
                      >
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved & Verified</option>
                        <option value="rejected">Revision Requested</option>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="b-rev-by">Reviewer Name</Label>
                      <Input
                        id="b-rev-by"
                        value={draft.review?.reviewedBy || ''}
                        onChange={(e) =>
                          patch({
                            review: {
                              ...draft.review,
                              reviewedBy: e.target.value,
                            },
                          })
                        }
                        placeholder="Dr. Sarah Jenkins, PsyD"
                      />
                    </div>

                    <div>
                      <Label htmlFor="b-rev-date">Review Date</Label>
                      <Input
                        id="b-rev-date"
                        type="date"
                        value={
                          draft.review?.reviewedAt
                            ? new Date(draft.review.reviewedAt).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0]
                        }
                        onChange={(e) =>
                          patch({
                            review: {
                              ...draft.review,
                              reviewedAt: new Date(e.target.value).toISOString(),
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SEO & SHARING */}
            {tab === 'seo' && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="b-seo-title">SEO Meta Title</Label>
                  <Input
                    id="b-seo-title"
                    value={draft.seo?.metaTitle || ''}
                    onChange={(e) =>
                      patch({
                        seo: {
                          ...draft.seo,
                          metaTitle: e.target.value,
                        },
                      })
                    }
                    placeholder={`${draft.resourceTitle || 'Resource'} | Mental Health Support`}
                  />
                </div>

                <div>
                  <Label htmlFor="b-seo-desc">SEO Meta Description</Label>
                  <Textarea
                    id="b-seo-desc"
                    rows={3}
                    value={draft.seo?.metaDescription || ''}
                    onChange={(e) =>
                      patch({
                        seo: {
                          ...draft.seo,
                          metaDescription: e.target.value,
                        },
                      })
                    }
                    placeholder="Confidential, evidence-based coping guide and emergency resources..."
                  />
                </div>

                <div>
                  <Label htmlFor="b-seo-og">Social Preview (OG) Image URL</Label>
                  <Input
                    id="b-seo-og"
                    value={draft.seo?.ogImage || ''}
                    onChange={(e) =>
                      patch({
                        seo: {
                          ...draft.seo,
                          ogImage: e.target.value,
                        },
                      })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-time Live Website Preview */}
        <div className="lg:col-span-6 xl:col-span-6 lg:sticky lg:top-4 space-y-3">
          {/* Preview Controller Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-ink">Live Website Preview</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center rounded-lg bg-canvas p-0.5 border border-line">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  previewDevice === 'desktop'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-body hover:text-ink'
                )}
                title="Desktop / Laptop View"
              >
                <LaptopIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Laptop</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('tablet')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  previewDevice === 'tablet'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-body hover:text-ink'
                )}
                title="Tablet View"
              >
                <TabletIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  previewDevice === 'mobile'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-body hover:text-ink'
                )}
                title="Mobile Phone View"
              >
                <SmartphoneIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPreviewKey((k) => k + 1)}
                className="rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink"
                title="Refresh preview"
              >
                <RefreshCwIcon className="h-3.5 w-3.5" />
              </button>
              <a
                href={`/resource/${draft.id}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink"
                title="Open in new tab"
              >
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Device Mockup Wrapper */}
          <div className="flex justify-center items-center overflow-hidden rounded-2xl border border-line bg-canvas/60 p-2 sm:p-4 shadow-sm h-[78vh]">
            {previewDevice === 'desktop' && (
              <div className="flex flex-col w-full h-full overflow-hidden rounded-xl border border-line bg-canvas shadow-lg">
                {/* Browser Address Bar */}
                <div className="flex items-center gap-2 border-b border-line bg-surface/90 px-3.5 py-2">
                  <div className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 rounded-md bg-canvas px-2.5 py-0.5 text-[10.5px] text-subtle border border-line w-full max-w-sm">
                      <LockIcon className="h-2.5 w-2.5 text-emerald-500" />
                      <span className="font-mono truncate">
                        https://support.mentalhealth.org/resource/{draft.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Render Website Live */}
                <div className="flex-1 overflow-y-auto">
                  <ResourceWebsiteRenderer key={previewKey} resource={draft} />
                </div>
              </div>
            )}

            {previewDevice === 'tablet' && (
              <div className="flex flex-col w-[520px] max-w-full h-full overflow-hidden rounded-2xl border-[6px] border-slate-800 bg-canvas shadow-xl">
                <div className="flex-1 overflow-y-auto">
                  <ResourceWebsiteRenderer key={previewKey} resource={draft} />
                </div>
              </div>
            )}

            {previewDevice === 'mobile' && (
              <div className="flex flex-col w-[340px] max-w-full h-full overflow-hidden rounded-[36px] border-[8px] border-slate-900 bg-canvas shadow-xl">
                <div className="flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-semibold text-ink bg-surface border-b border-line/40">
                  <span>9:41</span>
                  <span className="h-3.5 w-16 rounded-full bg-slate-900" />
                  <span>100%</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ResourceWebsiteRenderer key={previewKey} resource={draft} isMobilePreview />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function useMemoTopic(topics: TopicAndResource[], id?: string): TopicAndResource | undefined {
  return React.useMemo(() => {
    if (!id) return undefined;
    return topics.find((t) => t.id === id);
  }, [topics, id]);
}
