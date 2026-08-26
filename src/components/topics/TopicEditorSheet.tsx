import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  EyeIcon,
  ShieldCheckIcon,
  GlobeIcon,
  LayersIcon,
  InfoIcon,
  SparklesIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react';
import { TONE_KEYS, TONE_META, createDefaultBlock } from '../../data/topics';
import type {
  TopicAndResource,
  ToneKey,
  IResourceLink,
} from '../../types';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Input, Label, SegmentedControl, Switch, Textarea, Select } from '../ui/Field';
import { IconPicker } from './IconPicker';
import { SectionListBuilder } from './SectionListBuilder';
import { WebsitePreviewModal } from './WebsitePreviewModal';
import { cn } from '../../utils/cn';

export function emptyTopic(): TopicAndResource {
  const id = `tp-${Math.random().toString(36).slice(2, 9)}`;
  return {
    id,
    topicTitle: '',
    resourceTitle: '',
    slug: '',
    tone: 'sky',
    icon: 'Leaf',
    category: 'Mental Health',
    shortDescription: '',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    status: 'draft',
    isPublished: false,
    updatedAt: new Date().toISOString(),
    demand: 0,
    safety: {
      hasCrisisInformation: true,
      crisisResources: [
        { id: 'cr-default-1', title: '988 Suicide & Crisis Lifeline', url: 'tel:988', linkType: 'helpline', description: 'Free 24/7 Call/Text' },
      ],
      disclaimer: 'This resource is educational and is not medical advice. If you are in immediate danger, please call 988 or 911.',
    },
    review: {
      reviewedBy: 'Staff Clinical Lead',
      reviewedAt: new Date().toISOString(),
      reviewStatus: 'pending',
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('symptoms_grid', 2),
      createDefaultBlock('coping_strategies', 3),
      createDefaultBlock('faq_accordion', 4),
      createDefaultBlock('disclaimer', 5),
    ],
    // Backwards compatibility
    title: '',
    subtitle: '',
    intro: '',
    rationale: '',
    packetTitle: '',
    article: '',
    items: [],
  };
}

interface Errors {
  topicTitle?: string;
  resourceTitle?: string;
  slug?: string;
}

function validate(resource: TopicAndResource): Errors {
  const errors: Errors = {};
  if (!resource.topicTitle || resource.topicTitle.trim().length < 2) {
    errors.topicTitle = 'Topic name is required (e.g. Anxiety, Grief).';
  }
  if (!resource.resourceTitle || resource.resourceTitle.trim().length < 3) {
    errors.resourceTitle = 'Resource website title is required.';
  }
  if (!resource.slug || resource.slug.trim().length < 2) {
    errors.slug = 'URL slug is required (e.g. anxiety-guide).';
  }
  return errors;
}

type Tab = 'basic' | 'sections' | 'safety' | 'seo';

export function TopicEditorSheet({
  open,
  topic,
  onClose,
  onSave,
}: {
  open: boolean;
  topic: TopicAndResource | null;
  onClose: () => void;
  onSave: (topic: TopicAndResource) => void;
}) {
  const [draft, setDraft] = useState<TopicAndResource>(topic ?? emptyTopic());
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>('basic');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (topic) {
        setDraft({
          ...topic,
          topicTitle: topic.topicTitle || topic.title || '',
          resourceTitle: topic.resourceTitle || topic.packetTitle || topic.title || '',
          slug: topic.slug || (topic.title ? topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'resource'),
          category: topic.category || 'Mental Health',
          sections: topic.sections && topic.sections.length > 0 ? topic.sections : emptyTopic().sections,
          safety: topic.safety || emptyTopic().safety,
          review: topic.review || emptyTopic().review,
          seo: topic.seo || emptyTopic().seo,
        });
      } else {
        setDraft(emptyTopic());
      }
      setErrors({});
      setSaving(false);
      setTab('basic');
    }
  }, [open, topic]);

  const patch = (values: Partial<TopicAndResource>) =>
    setDraft((prev) => {
      const updated = { ...prev, ...values };
      // Sync backward compatibility fields
      if (values.topicTitle !== undefined) updated.title = values.topicTitle;
      if (values.resourceTitle !== undefined) updated.packetTitle = values.resourceTitle;
      if (values.shortDescription !== undefined) updated.subtitle = values.shortDescription;
      return updated;
    });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTopicTitleChange = (val: string) => {
    const autoSlug = !draft.slug || draft.slug === generateSlug(draft.topicTitle || '');
    patch({
      topicTitle: val,
      slug: autoSlug ? generateSlug(val) : draft.slug,
      resourceTitle: draft.resourceTitle || val,
    });
  };

  const submit = () => {
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setTab('basic');
      toast.error('Please complete required fields before saving.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onSave({
        ...draft,
        title: draft.topicTitle,
        packetTitle: draft.resourceTitle,
        subtitle: draft.shortDescription || draft.subtitle || '',
        isPublished: draft.status === 'published',
      });
      setSaving(false);
      toast.success(
        draft.status === 'published'
          ? `“${draft.topicTitle}” published live!`
          : `“${draft.topicTitle}” saved as draft.`
      );
      onClose();
    }, 380);
  };

  return (
    <>
      <Sheet
        open={open}
        onClose={onClose}
        title={topic ? `Edit Resource: ${draft.topicTitle || topic.title}` : 'Create New Topic & Resource'}
        description="Configure topic info, modular website sections, safety settings, and SEO."
        width="max-w-4xl"
        footer={
          <div className="flex w-full items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPreviewOpen(true)}
            >
              <EyeIcon className="h-4 w-4" />
              Preview Website
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? 'Saving…' : draft.status === 'published' ? 'Save & Publish' : 'Save Draft'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="p-6 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
            <SegmentedControl<Tab>
              ariaLabel="Editor tab"
              value={tab}
              onChange={setTab}
              options={[
                { value: 'basic', label: '1. Basic Info & Style' },
                { value: 'sections', label: `2. Content Sections (${(draft.sections || []).length})` },
                { value: 'safety', label: '3. Safety & Disclaimer' },
                { value: 'seo', label: '4. SEO & Metadata' },
              ]}
            />

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-ink hover:border-primary hover:text-primary transition-colors"
            >
              <EyeIcon className="h-3.5 w-3.5" />
              Live Preview
            </button>
          </div>

          {/* TAB 1: BASIC INFORMATION */}
          {tab === 'basic' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="topic-name">Topic Name (App Display)</Label>
                  <Input
                    id="topic-name"
                    value={draft.topicTitle}
                    onChange={(e) => handleTopicTitleChange(e.target.value)}
                    placeholder="e.g. Anxiety, Depression, Burnout"
                    aria-invalid={Boolean(errors.topicTitle)}
                  />
                  {errors.topicTitle ? <p className="mt-1 text-xs text-danger">{errors.topicTitle}</p> : null}
                  <p className="mt-1 text-[11.5px] text-subtle">
                    Shown on the mobile app topic selection wheel and transmission feed.
                  </p>
                </div>

                <div>
                  <Label htmlFor="resource-title">Resource Website Headline</Label>
                  <Input
                    id="resource-title"
                    value={draft.resourceTitle}
                    onChange={(e) => patch({ resourceTitle: e.target.value })}
                    placeholder="e.g. Understanding Anxiety: A Compassionate Guide"
                    aria-invalid={Boolean(errors.resourceTitle)}
                  />
                  {errors.resourceTitle ? <p className="mt-1 text-xs text-danger">{errors.resourceTitle}</p> : null}
                  <p className="mt-1 text-[11.5px] text-subtle">
                    Primary title rendered at the top of the recipient’s public web page.
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="short-desc">Short Subtitle / Description</Label>
                <Textarea
                  id="short-desc"
                  rows={2}
                  value={draft.shortDescription || ''}
                  onChange={(e) => patch({ shortDescription: e.target.value })}
                  placeholder="For the person whose mind will not slow down..."
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label hint="Drives theme styling, card tints, and hero colors">Tone Palette</Label>
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
                  <p className="mt-1.5 text-[11.5px] text-subtle">
                    Recommended for: {TONE_META[draft.tone]?.usage}.
                  </p>
                </div>

                <div>
                  <Label>Topic Icon</Label>
                  <IconPicker value={draft.icon || 'Leaf'} onChange={(icon) => patch({ icon })} />
                </div>
              </div>

              <div>
                <Label htmlFor="featured-image">Featured Image URL</Label>
                <Input
                  id="featured-image"
                  value={draft.featuredImage}
                  onChange={(e) => patch({ featuredImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="rounded-xl border border-line bg-surface p-4">
                <Switch
                  checked={draft.status === 'published'}
                  onChange={(next) => patch({ status: next ? 'published' : 'draft', isPublished: next })}
                  label="Published to the mobile app & web"
                  description={
                    draft.status === 'published'
                      ? 'Available in the app topic picker and accessible via public link.'
                      : 'Hidden in draft mode; links are restricted to admins.'
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
            <div className="space-y-6">
              <div className="rounded-xl border border-line bg-surface p-5 space-y-4">
                <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-primary" />
                  Crisis Detection & Emergency Safety
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
                  label="Display Crisis Hotlines on Webpage"
                  description="Automatically surface 24/7 hotline numbers and instant dial buttons on this resource."
                />

                <div>
                  <Label htmlFor="safety-disc">Standard Clinical Disclaimer</Label>
                  <Textarea
                    id="safety-disc"
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
                    placeholder="This resource is educational and not medical advice..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO & METADATA */}
          {tab === 'seo' && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="seo-title">SEO Meta Title</Label>
                <Input
                  id="seo-title"
                  value={draft.seo?.metaTitle || ''}
                  onChange={(e) =>
                    patch({
                      seo: {
                        ...draft.seo,
                        metaTitle: e.target.value,
                      },
                    })
                  }
                  placeholder={`${draft.resourceTitle || 'Anxiety Guide'} | Mental Health Support`}
                />
              </div>

              <div>
                <Label htmlFor="seo-desc">SEO Meta Description</Label>
                <Textarea
                  id="seo-desc"
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
                <Label htmlFor="seo-og">Social Preview (OG) Image URL</Label>
                <Input
                  id="seo-og"
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
      </Sheet>

      {/* Website Preview Modal */}
      <WebsitePreviewModal
        open={previewOpen}
        resource={draft}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}