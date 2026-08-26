import React from 'react';
import { PlusIcon, Trash2Icon, HelpCircleIcon, Image as ImageIcon } from 'lucide-react';
import type {
  IResourceBlock,
  IBlockContent,
  ISymptomItem,
  IWarningSignItem,
  IFeatureItem,
  ICopingStrategy,
  ITreatmentOption,
  IAccordionItem,
  IResourceLink,
  IMythFactItem,
  IGroundingContent,
  IMythsFactsContent,
} from '../../types';
import { Input, Label, Textarea, Select } from '../ui/Field';
import { Button } from '../ui/Button';
import { JoditRichText } from '../ui/JoditRichText';

interface SectionBlockEditorProps {
  block: IResourceBlock;
  onChange: (updated: IResourceBlock) => void;
}

export function SectionBlockEditor({ block, onChange }: SectionBlockEditorProps) {
  const content = block.content;

  const patchContent = (patch: Partial<IBlockContent>) => {
    onChange({
      ...block,
      content: {
        ...block.content,
        ...patch,
      },
    });
  };

  const uid = () => `item-${Math.random().toString(36).slice(2, 8)}`;

  switch (block.blockType) {
    case 'hero_section': {
      const hero = content.hero || { headline: '', subheadline: '', bgImage: '' };
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="hero-headline">Headline</Label>
            <Input
              id="hero-headline"
              value={hero.headline}
              onChange={(e) => patchContent({ hero: { ...hero, headline: e.target.value } })}
              placeholder="e.g. Understanding & Navigating Anxiety"
            />
          </div>
          <div>
            <Label htmlFor="hero-subheadline">Subheadline</Label>
            <Textarea
              id="hero-subheadline"
              rows={2}
              value={hero.subheadline || ''}
              onChange={(e) => patchContent({ hero: { ...hero, subheadline: e.target.value } })}
              placeholder="A supportive subheadline introducing the resource packet"
            />
          </div>
          <div>
            <Label htmlFor="hero-bg">Background Image URL (Optional)</Label>
            <Input
              id="hero-bg"
              value={hero.bgImage || ''}
              onChange={(e) => patchContent({ hero: { ...hero, bgImage: e.target.value } })}
              placeholder="https://images.unsplash.com/photo-..."
            />
            {hero.bgImage ? (
              <div className="mt-2 h-28 w-full overflow-hidden rounded-lg border border-line bg-canvas">
                <img src={hero.bgImage} alt="Hero preview" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    case 'intro_section': {
      const intro = content.intro || { title: '', description: '' };
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="intro-title">Section Title</Label>
            <Input
              id="intro-title"
              value={intro.title}
              onChange={(e) => patchContent({ intro: { ...intro, title: e.target.value } })}
              placeholder="e.g. You Are Not Alone in This"
            />
          </div>
          <div>
            <Label htmlFor="intro-desc">Description / Framing Text</Label>
            <Textarea
              id="intro-desc"
              rows={4}
              value={intro.description}
              onChange={(e) => patchContent({ intro: { ...intro, description: e.target.value } })}
              placeholder="Explain why this resource was prepared and reassure the reader."
            />
          </div>
        </div>
      );
    }

    case 'rich_text_jodit': {
      return (
        <div className="space-y-2">
          <Label hint="WYSIWYG HTML article content">Rich Text Article</Label>
          <JoditRichText
            key={block.id}
            value={content.richTextHtml || ''}
            height={380}
            placeholder="Write clinical guidance, personal stories, or structured article content…"
            onChange={(html) => patchContent({ richTextHtml: html })}
          />
        </div>
      );
    }

    case 'symptoms_grid': {
      const symptoms = content.symptoms || [];
      const addSymptom = () => {
        const next: ISymptomItem[] = [
          ...symptoms,
          { id: uid(), title: 'New Symptom', description: 'Brief explanation of this physical or emotional sensation.' },
        ];
        patchContent({ symptoms: next });
      };

      const updateSymptom = (index: number, patch: Partial<ISymptomItem>) => {
        const next = symptoms.map((s, i) => (i === index ? { ...s, ...patch } : s));
        patchContent({ symptoms: next });
      };

      const removeSymptom = (index: number) => {
        patchContent({ symptoms: symptoms.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint={`${symptoms.length} items configured`}>Symptoms & Sensations List</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addSymptom}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Symptom
            </Button>
          </div>
          <div className="space-y-3">
            {symptoms.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-subtle">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSymptom(idx)}
                    className="rounded p-1 text-subtle hover:bg-danger-bg hover:text-danger"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Symptom Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateSymptom(idx, { title: e.target.value })}
                      placeholder="e.g. Racing Heart"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => updateSymptom(idx, { description: e.target.value })}
                      placeholder="e.g. Adrenaline causing pulse to accelerate"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'warning_signs': {
      const warningSigns = content.warningSigns || [];
      const addSign = () => {
        const next: IWarningSignItem[] = [
          ...warningSigns,
          { id: uid(), title: 'New Warning Sign', description: 'When to seek urgent or professional support.' },
        ];
        patchContent({ warningSigns: next });
      };

      const updateSign = (index: number, patch: Partial<IWarningSignItem>) => {
        const next = warningSigns.map((s, i) => (i === index ? { ...s, ...patch } : s));
        patchContent({ warningSigns: next });
      };

      const removeSign = (index: number) => {
        patchContent({ warningSigns: warningSigns.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint={`${warningSigns.length} warning signs`}>Warning Signs List</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addSign}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Warning Sign
            </Button>
          </div>
          <div className="space-y-3">
            {warningSigns.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-warning/30 bg-warning/5 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-warning">Alert #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSign(idx)}
                    className="rounded p-1 text-subtle hover:bg-danger-bg hover:text-danger"
                  >
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Alert Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateSign(idx, { title: e.target.value })}
                      placeholder="e.g. Prolonged Sleep Breakdown"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Details</Label>
                    <Input
                      value={item.description || ''}
                      onChange={(e) => updateSign(idx, { description: e.target.value })}
                      placeholder="e.g. Lasting longer than two weeks consistently"
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'info_cards': {
      const features = content.features || [];
      const addFeature = () => {
        patchContent({
          features: [...features, { id: uid(), title: 'Core Insight', description: 'Detailed point explaining this concept.' }],
        });
      };
      const updateFeature = (index: number, patch: Partial<IFeatureItem>) => {
        patchContent({ features: features.map((f, i) => (i === index ? { ...f, ...patch } : f)) });
      };
      const removeFeature = (index: number) => {
        patchContent({ features: features.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint="Highlight key concepts">Information Cards</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addFeature}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Card
            </Button>
          </div>
          <div className="space-y-3">
            {features.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-subtle">Card #{idx + 1}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateFeature(idx, { title: e.target.value })}
                    placeholder="Card title"
                    className="text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => updateFeature(idx, { description: e.target.value })}
                    placeholder="Card explanation..."
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'image_text': {
      const it = content.imageText || { title: '', description: '', imageUrl: '', imagePosition: 'right' };
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="it-title">Section Title (Optional)</Label>
              <Input
                id="it-title"
                value={it.title || ''}
                onChange={(e) => patchContent({ imageText: { ...it, title: e.target.value } })}
                placeholder="e.g. The Science of the Nervous System"
              />
            </div>
            <div>
              <Label htmlFor="it-pos">Image Position</Label>
              <Select
                id="it-pos"
                value={it.imagePosition || 'right'}
                onChange={(e) => patchContent({ imageText: { ...it, imagePosition: e.target.value as 'left' | 'right' } })}
              >
                <option value="right">Image on Right</option>
                <option value="left">Image on Left</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="it-desc">Text Content</Label>
            <Textarea
              id="it-desc"
              rows={4}
              value={it.description}
              onChange={(e) => patchContent({ imageText: { ...it, description: e.target.value } })}
              placeholder="Descriptive explanation alongside the image..."
            />
          </div>
          <div>
            <Label htmlFor="it-img">Image URL</Label>
            <Input
              id="it-img"
              value={it.imageUrl}
              onChange={(e) => patchContent({ imageText: { ...it, imageUrl: e.target.value } })}
              placeholder="https://images.unsplash.com/..."
            />
            {it.imageUrl ? (
              <div className="mt-2 h-32 w-48 overflow-hidden rounded-lg border border-line bg-canvas">
                <img src={it.imageUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    case 'quote_callout': {
      const quote = content.quote || { text: '', author: '' };
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="quote-text">Quote Text</Label>
            <Textarea
              id="quote-text"
              rows={3}
              value={quote.text}
              onChange={(e) => patchContent({ quote: { ...quote, text: e.target.value } })}
              placeholder="e.g. You do not have to control your thoughts. You just have to stop letting them control you."
            />
          </div>
          <div>
            <Label htmlFor="quote-author">Author / Attributed To (Optional)</Label>
            <Input
              id="quote-author"
              value={quote.author || ''}
              onChange={(e) => patchContent({ quote: { ...quote, author: e.target.value } })}
              placeholder="e.g. Dan Millman or Dr. Kristin Neff"
            />
          </div>
        </div>
      );
    }

    case 'coping_strategies': {
      const strategies = content.copingStrategies || [];
      const addStrategy = () => {
        patchContent({
          copingStrategies: [
            ...strategies,
            { id: uid(), title: 'Grounding Technique', description: 'Step-by-step instructions on how to practice this.' },
          ],
        });
      };
      const updateStrategy = (index: number, patch: Partial<ICopingStrategy>) => {
        patchContent({ copingStrategies: strategies.map((c, i) => (i === index ? { ...c, ...patch } : c)) });
      };
      const removeStrategy = (index: number) => {
        patchContent({ copingStrategies: strategies.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint="Practical, actionable coping tools">Coping Strategies List</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addStrategy}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Strategy
            </Button>
          </div>
          <div className="space-y-3">
            {strategies.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-primary/20 bg-primary-tint/30 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">Strategy #{idx + 1}</span>
                  <button type="button" onClick={() => removeStrategy(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateStrategy(idx, { title: e.target.value })}
                    placeholder="Strategy title (e.g. 4-7-8 Breathing)"
                    className="text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => updateStrategy(idx, { description: e.target.value })}
                    placeholder="How to practice this in the moment..."
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'treatment_options': {
      const options = content.treatmentOptions || [];
      const addOption = () => {
        patchContent({
          treatmentOptions: [
            ...options,
            { id: uid(), title: 'Therapeutic Approach', description: 'Explanation of this evidence-based clinical modality.' },
          ],
        });
      };
      const updateOption = (index: number, patch: Partial<ITreatmentOption>) => {
        patchContent({ treatmentOptions: options.map((t, i) => (i === index ? { ...t, ...patch } : t)) });
      };
      const removeOption = (index: number) => {
        patchContent({ treatmentOptions: options.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint="Clinical and therapeutic options">Treatment Pathways</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addOption}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Treatment
            </Button>
          </div>
          <div className="space-y-3">
            {options.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-subtle">Treatment #{idx + 1}</span>
                  <button type="button" onClick={() => removeOption(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <Input
                    value={item.title}
                    onChange={(e) => updateOption(idx, { title: e.target.value })}
                    placeholder="Treatment Name (e.g. CBT, ACT, EMDR)"
                    className="text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={item.description || ''}
                    onChange={(e) => updateOption(idx, { description: e.target.value })}
                    placeholder="Brief description of what this involves and who it helps..."
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'supporting_someone': {
      const sup = content.supportingSomeone || { title: 'How to Support Someone', description: '', tips: [] };
      const tips = sup.tips || [];
      const addTip = () => {
        const nextTips = [...tips, { id: uid(), title: 'Support Tip', description: 'What to say or do.' }];
        patchContent({ supportingSomeone: { ...sup, tips: nextTips } });
      };
      const updateTip = (index: number, patch: Partial<IFeatureItem>) => {
        const nextTips = tips.map((t, i) => (i === index ? { ...t, ...patch } : t));
        patchContent({ supportingSomeone: { ...sup, tips: nextTips } });
      };
      const removeTip = (index: number) => {
        patchContent({ supportingSomeone: { ...sup, tips: tips.filter((_, i) => i !== index) } });
      };

      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="sup-title">Section Title</Label>
            <Input
              id="sup-title"
              value={sup.title}
              onChange={(e) => patchContent({ supportingSomeone: { ...sup, title: e.target.value } })}
              placeholder="If You Are Supporting a Loved One"
            />
          </div>
          <div>
            <Label htmlFor="sup-desc">Introduction</Label>
            <Textarea
              id="sup-desc"
              rows={2}
              value={sup.description}
              onChange={(e) => patchContent({ supportingSomeone: { ...sup, description: e.target.value } })}
              placeholder="Guidance for friends and family members..."
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Support Tips</Label>
              <Button type="button" size="sm" variant="secondary" onClick={addTip}>
                <PlusIcon className="h-3.5 w-3.5" /> Add Tip
              </Button>
            </div>
            {tips.map((tip, idx) => (
              <div key={tip.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-subtle">Tip #{idx + 1}</span>
                  <button type="button" onClick={() => removeTip(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <Input
                    value={tip.title}
                    onChange={(e) => updateTip(idx, { title: e.target.value })}
                    placeholder="Tip title (e.g. Listen without fixing)"
                    className="text-xs"
                  />
                  <Input
                    value={tip.description || ''}
                    onChange={(e) => updateTip(idx, { description: e.target.value })}
                    placeholder="Concrete phrase to say or action to take"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'interactive_grounding_tool': {
      const gt = content.groundingTool || {
        title: 'Live 4-7-8 Calming Breath Pacer',
        description: 'A direct neurological switch into the calming parasympathetic branch of your nervous system.',
        technique: '4-7-8',
        guidanceText: 'Breathe in quietly through the nose for 4 counts, hold your breath for 7 counts, and exhale completely with a whoosh for 8 counts.',
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="gt-title">Exercise Title</Label>
              <Input
                id="gt-title"
                value={gt.title}
                onChange={(e) => patchContent({ groundingTool: { ...gt, title: e.target.value } })}
                placeholder="e.g. Live 4-7-8 Breath Pacer"
              />
            </div>
            <div>
              <Label htmlFor="gt-tech">Breathing Technique / Rhythm</Label>
              <Select
                id="gt-tech"
                value={gt.technique || '4-7-8'}
                onChange={(e) => patchContent({ groundingTool: { ...gt, technique: e.target.value as any } })}
              >
                <option value="4-7-8">4-7-8 Relaxing Breath (Inhale 4s, Hold 7s, Exhale 8s)</option>
                <option value="box_4_4_4_4">Box Breathing (Inhale 4s, Hold 4s, Exhale 4s, Hold 4s)</option>
                <option value="calm_4_6">Calm Deep Breathing (Inhale 4s, Exhale 6s)</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="gt-desc">Description / Neurological Purpose</Label>
            <Textarea
              id="gt-desc"
              rows={2}
              value={gt.description || ''}
              onChange={(e) => patchContent({ groundingTool: { ...gt, description: e.target.value } })}
              placeholder="Why this helps calm down panic or anxiety..."
            />
          </div>
          <div>
            <Label htmlFor="gt-guidance">Step-by-step Guidance Text</Label>
            <Textarea
              id="gt-guidance"
              rows={2}
              value={gt.guidanceText || ''}
              onChange={(e) => patchContent({ groundingTool: { ...gt, guidanceText: e.target.value } })}
              placeholder="Inhale quietly through nose, hold, and slowly exhale..."
            />
          </div>
        </div>
      );
    }

    case 'myths_vs_facts': {
      const mf = content.mythsFacts || {
        title: 'Myths vs. Clinical Realities',
        description: 'Dispelling common misconceptions to reduce shame and self-blame.',
        items: [],
      };
      const items = mf.items || [];
      const addItem = () => {
        patchContent({
          mythsFacts: {
            ...mf,
            items: [
              ...items,
              {
                id: uid(),
                myth: 'Common misconception or harmful myth...',
                fact: 'Empirical clinical fact or reality...',
              },
            ],
          },
        });
      };
      const updateItem = (index: number, patch: Partial<IMythFactItem>) => {
        patchContent({
          mythsFacts: {
            ...mf,
            items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
          },
        });
      };
      const removeItem = (index: number) => {
        patchContent({
          mythsFacts: {
            ...mf,
            items: items.filter((_, i) => i !== index),
          },
        });
      };

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="mf-title">Section Title</Label>
              <Input
                id="mf-title"
                value={mf.title}
                onChange={(e) => patchContent({ mythsFacts: { ...mf, title: e.target.value } })}
                placeholder="Myths vs. Clinical Realities"
              />
            </div>
            <div>
              <Label htmlFor="mf-desc">Introduction / Subtitle</Label>
              <Input
                id="mf-desc"
                value={mf.description || ''}
                onChange={(e) => patchContent({ mythsFacts: { ...mf, description: e.target.value } })}
                placeholder="Dispelling common misconceptions..."
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Myth vs. Fact Comparisons</Label>
              <Button type="button" size="sm" variant="secondary" onClick={addItem}>
                <PlusIcon className="h-3.5 w-3.5" /> Add Myth & Fact
              </Button>
            </div>
            {items.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-subtle">Item #{idx + 1}</span>
                  <button type="button" onClick={() => removeItem(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Myth / Misconception</label>
                  <Input
                    value={item.myth}
                    onChange={(e) => updateItem(idx, { myth: e.target.value })}
                    placeholder="e.g. Anxiety is just overthinking..."
                    className="text-xs mt-0.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Clinical Fact & Reality</label>
                  <Textarea
                    rows={2}
                    value={item.fact}
                    onChange={(e) => updateItem(idx, { fact: e.target.value })}
                    placeholder="e.g. Anxiety is an involuntary nervous system response..."
                    className="text-xs mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'faq_accordion': {
      const items = content.accordionItems || [];
      const addFaq = () => {
        patchContent({
          accordionItems: [
            ...items,
            { id: uid(), question: 'Frequently asked question?', answer: 'Clear, concise, and helpful answer.' },
          ],
        });
      };
      const updateFaq = (index: number, patch: Partial<IAccordionItem>) => {
        patchContent({ accordionItems: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
      };
      const removeFaq = (index: number) => {
        patchContent({ accordionItems: items.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint="Collapsible Q&A items">FAQ Accordion Items</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addFaq}>
              <PlusIcon className="h-3.5 w-3.5" /> Add FAQ
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-subtle">Q#{idx + 1}</span>
                  <button type="button" onClick={() => removeFaq(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <Input
                    value={item.question}
                    onChange={(e) => updateFaq(idx, { question: e.target.value })}
                    placeholder="Question (e.g. Is this anonymous?)"
                    className="text-xs font-medium"
                  />
                  <Textarea
                    rows={2}
                    value={item.answer}
                    onChange={(e) => updateFaq(idx, { answer: e.target.value })}
                    placeholder="Answer..."
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'resource_links': {
      const links = content.resources || [];
      const addLink = () => {
        patchContent({
          resources: [
            ...links,
            { id: uid(), title: 'Resource Name', description: 'Helpful detail', url: 'https://', linkType: 'website' },
          ],
        });
      };
      const updateLink = (index: number, patch: Partial<IResourceLink>) => {
        patchContent({ resources: links.map((l, i) => (i === index ? { ...l, ...patch } : l)) });
      };
      const removeLink = (index: number) => {
        patchContent({ resources: links.filter((_, i) => i !== index) });
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label hint="Directories, helplines, websites">Resource Links Directory</Label>
            <Button type="button" size="sm" variant="secondary" onClick={addLink}>
              <PlusIcon className="h-3.5 w-3.5" /> Add Resource Link
            </Button>
          </div>
          <div className="space-y-3">
            {links.map((item, idx) => (
              <div key={item.id || idx} className="rounded-lg border border-line bg-canvas/60 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-subtle">Resource #{idx + 1}</span>
                  <button type="button" onClick={() => removeLink(idx)} className="rounded p-1 text-subtle hover:text-danger">
                    <Trash2Icon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input
                    value={item.title}
                    onChange={(e) => updateLink(idx, { title: e.target.value })}
                    placeholder="Resource Name"
                    className="text-xs font-medium"
                  />
                  <Input
                    value={item.url}
                    onChange={(e) => updateLink(idx, { url: e.target.value })}
                    placeholder="URL (e.g. tel:988 or https://...)"
                    className="text-xs"
                  />
                  <Select
                    value={item.linkType || 'website'}
                    onChange={(e) => updateLink(idx, { linkType: e.target.value as any })}
                    className="text-xs"
                  >
                    <option value="helpline">Helpline / Phone</option>
                    <option value="website">Website</option>
                    <option value="organization">Organization</option>
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                  </Select>
                </div>
                <div className="mt-2">
                  <Input
                    value={item.description || ''}
                    onChange={(e) => updateLink(idx, { description: e.target.value })}
                    placeholder="Brief description (e.g. Free 24/7 confidential support)"
                    className="text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'crisis_banner': {
      const crisis = content.crisis || { title: 'Are You in Immediate Crisis?', description: '', emergencyNumber: '988', resources: [] };
      return (
        <div className="space-y-4 rounded-lg border border-danger/30 bg-danger-bg/40 p-4">
          <div>
            <Label htmlFor="cr-title" className="text-danger font-semibold">Crisis Alert Title</Label>
            <Input
              id="cr-title"
              value={crisis.title}
              onChange={(e) => patchContent({ crisis: { ...crisis, title: e.target.value } })}
              placeholder="Are You in Immediate Danger or Crisis?"
            />
          </div>
          <div>
            <Label htmlFor="cr-desc">Description & Emergency Reassurance</Label>
            <Textarea
              id="cr-desc"
              rows={2}
              value={crisis.description}
              onChange={(e) => patchContent({ crisis: { ...crisis, description: e.target.value } })}
              placeholder="Please reach out to emergency resources immediately. You are not alone."
            />
          </div>
          <div>
            <Label htmlFor="cr-num">Primary Emergency Hotline Dial</Label>
            <Input
              id="cr-num"
              value={crisis.emergencyNumber || ''}
              onChange={(e) => patchContent({ crisis: { ...crisis, emergencyNumber: e.target.value } })}
              placeholder="988"
            />
          </div>
        </div>
      );
    }

    case 'cta_banner': {
      const cta = content.cta || { title: '', description: '', buttonText: '', buttonLink: '' };
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="cta-title">Call to Action Title</Label>
            <Input
              id="cta-title"
              value={cta.title}
              onChange={(e) => patchContent({ cta: { ...cta, title: e.target.value } })}
              placeholder="Ready to Take the Next Step?"
            />
          </div>
          <div>
            <Label htmlFor="cta-desc">Supporting Copy</Label>
            <Textarea
              id="cta-desc"
              rows={2}
              value={cta.description || ''}
              onChange={(e) => patchContent({ cta: { ...cta, description: e.target.value } })}
              placeholder="Encourage the reader to explore directories or save this guide."
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="cta-btn">Button Text</Label>
              <Input
                id="cta-btn"
                value={cta.buttonText || ''}
                onChange={(e) => patchContent({ cta: { ...cta, buttonText: e.target.value } })}
                placeholder="Find a Therapist"
              />
            </div>
            <div>
              <Label htmlFor="cta-url">Button URL</Label>
              <Input
                id="cta-url"
                value={cta.buttonLink || ''}
                onChange={(e) => patchContent({ cta: { ...cta, buttonLink: e.target.value } })}
                placeholder="https://findtreatment.gov"
              />
            </div>
          </div>
        </div>
      );
    }

    case 'video': {
      const vid = content.video || { title: '', description: '', videoUrl: '', thumbnailUrl: '' };
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="vid-title">Video Title</Label>
            <Input
              id="vid-title"
              value={vid.title || ''}
              onChange={(e) => patchContent({ video: { ...vid, title: e.target.value } })}
              placeholder="Guided 3-Minute Grounding Exercise"
            />
          </div>
          <div>
            <Label htmlFor="vid-url">Video Embed URL (YouTube or Vimeo embed link)</Label>
            <Input
              id="vid-url"
              value={vid.videoUrl}
              onChange={(e) => patchContent({ video: { ...vid, videoUrl: e.target.value } })}
              placeholder="https://www.youtube-nocookie.com/embed/..."
            />
          </div>
          <div>
            <Label htmlFor="vid-desc">Video Summary</Label>
            <Textarea
              id="vid-desc"
              rows={2}
              value={vid.description || ''}
              onChange={(e) => patchContent({ video: { ...vid, description: e.target.value } })}
              placeholder="Describe what the viewer will experience in this video..."
            />
          </div>
        </div>
      );
    }

    case 'disclaimer': {
      const disc = content.disclaimer || { text: '' };
      return (
        <div className="space-y-2">
          <Label htmlFor="disc-text">Clinical & Legal Disclaimer</Label>
          <Textarea
            id="disc-text"
            rows={3}
            value={disc.text}
            onChange={(e) => patchContent({ disclaimer: { text: e.target.value } })}
            placeholder="Medical Disclaimer: This website is for educational purposes only..."
          />
        </div>
      );
    }

    default:
      return <p className="text-sm text-subtle">No editor fields for this block type.</p>;
  }
}
