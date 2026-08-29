import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  ShieldAlertIcon,
  PhoneCallIcon,
  MessageSquareIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  CheckIcon,
  HeartIcon,
  SparklesIcon,
  ShieldCheckIcon,
  QuoteIcon,
  InfoIcon,
  ArrowRightIcon,
  WindIcon,
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FlagIcon,
  XIcon,
} from 'lucide-react';
import type {
  TopicAndResource,
  ResourceLayoutStyle,
  IGroundingContent,
  IMythsFactsContent,
  ReportReasonCategory,
} from '../../types';
import { TONE_META } from '../../data/topics';
import { DynamicIcon } from '../ui/DynamicIcon';
import { useAdminStore } from '../../contexts/AdminStore';
import { cn } from '../../utils/cn';

interface ResourceWebsiteRendererProps {
  resource: TopicAndResource;
  isMobilePreview?: boolean;
}

export function ResourceWebsiteRenderer({ resource, isMobilePreview = false }: ResourceWebsiteRendererProps) {
  const tone = TONE_META[resource.tone] || TONE_META.sky;
  const sections = resource.sections || [];
  const { submitReport } = useAdminStore();

  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({});

  // Recipient Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReasonCategory, setReportReasonCategory] = useState<ReportReasonCategory>('unsolicited');
  const [reportReasonText, setReportReasonText] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportedPerson, setReportedPerson] = useState('');
  const [reportChannel, setReportChannel] = useState<'sms' | 'email'>('sms');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReasonText.trim()) {
      toast.error('Please describe the reason for your report.');
      return;
    }

    submitReport({
      reportedPersonName: reportedPerson.trim() || 'Message Sender',
      reportedPersonContact: reportedPerson.trim() || 'Confidential Sender',
      reportedByContact: reporterContact.trim() || 'Anonymous Receiver',
      reportedByChannel: reportChannel,
      topicTitle: resource.topicTitle || resource.title || 'Support Resource',
      reasonCategory: reportReasonCategory,
      reasonText: reportReasonText.trim(),
    });

    setIsSubmitted(true);
    toast.success('Your report has been submitted to system moderators.');
  };

  const resetReportForm = () => {
    setIsReportModalOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setReportReasonText('');
      setReporterContact('');
      setReportedPerson('');
      setReportReasonCategory('unsolicited');
    }, 300);
  };

  const getContainerClass = (style?: ResourceLayoutStyle) => {
    if (isMobilePreview) {
      return 'w-full px-3.5';
    }
    switch (style) {
      case 'full_width':
        return 'w-full';
      case 'container_centered':
        return 'mx-auto max-w-2xl px-4 sm:px-6';
      case 'accent_bg':
        return 'w-full rounded-2xl p-6 sm:p-8 bg-surface border border-line shadow-sm';
      default:
        return 'mx-auto max-w-4xl px-4 sm:px-6';
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-canvas text-ink font-sans antialiased selection:bg-primary-tint selection:text-primary transition-all',
        isMobilePreview ? 'text-[12.5px] leading-normal' : 'text-base leading-relaxed'
      )}
    >
      {/* Top Navigation / Branding Header */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-surface/90 backdrop-blur-md">
        <div
          className={cn(
            'mx-auto flex items-center justify-between',
            isMobilePreview ? 'px-3.5 py-2.5' : 'max-w-4xl px-4 py-3 sm:px-6'
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-lg border',
                tone.chip,
                isMobilePreview ? 'h-7 w-7' : 'h-8 w-8'
              )}
            >
              <DynamicIcon name={resource.icon || 'Leaf'} className={isMobilePreview ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xs font-bold text-ink sm:text-base">
                {resource.topicTitle || resource.title || 'Support Resource'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className={cn(
                'flex items-center gap-1 rounded-lg border border-line bg-canvas text-subtle hover:text-rose-600 hover:border-rose-300 transition-colors',
                isMobilePreview ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11.5px]'
              )}
              title="Report inappropriate message or unwanted contact"
            >
              <FlagIcon className="h-3 w-3" />
              <span>Report</span>
            </button>

            <span
              className={cn(
                'rounded-full border border-line bg-canvas font-medium text-body',
                isMobilePreview ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
              )}
            >
              Secure
            </span>
          </div>
        </div>
      </header>


      {/* Main Sections Stream */}
      <main
        className={cn(
          'space-y-6',
          isMobilePreview ? 'py-5 space-y-6' : 'py-8 sm:space-y-12 sm:py-12'
        )}
      >
        {sections.map((block, sIdx) => {
          const content = block.content;
          const containerCls = getContainerClass(block.layoutStyle);

          switch (block.blockType) {
            case 'hero_section': {
              const hero = content.hero;
              if (!hero) return null;
              return (
                <section key={block.id || sIdx} className={isMobilePreview ? 'px-3.5' : 'relative overflow-hidden px-4 sm:px-6'}>
                  <div
                    className={cn(
                      'relative mx-auto overflow-hidden border border-line shadow-sm',
                      isMobilePreview ? 'rounded-2xl p-5' : 'max-w-4xl rounded-3xl p-6 sm:p-12',
                      hero.bgImage ? 'bg-slate-900 text-white' : cn('bg-gradient-to-br', tone.gradient)
                    )}
                  >
                    {hero.bgImage ? (
                      <>
                        <img
                          src={hero.bgImage}
                          alt="Hero cover"
                          className="absolute inset-0 h-full w-full object-cover opacity-25 filter blur-[1px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-transparent" />
                      </>
                    ) : null}

                    <div className={cn('relative z-10 space-y-2.5', isMobilePreview ? 'max-w-full' : 'max-w-2xl space-y-4')}>
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 font-medium backdrop-blur-sm',
                          isMobilePreview ? 'px-2.5 py-0.5 text-[10.5px]' : 'px-3 py-1 text-xs'
                        )}
                      >
                        <SparklesIcon className="h-3 w-3 text-primary" />
                        <span>Confidential Guide</span>
                      </div>
                      <h1
                        className={cn(
                          'font-display font-bold tracking-tight text-ink',
                          hero.bgImage ? 'text-white' : '',
                          isMobilePreview ? 'text-lg leading-tight' : 'text-2xl sm:text-4xl lg:text-5xl leading-tight'
                        )}
                      >
                        {hero.headline || resource.resourceTitle}
                      </h1>
                      {hero.subheadline ? (
                        <p
                          className={cn(
                            'leading-relaxed font-light opacity-90',
                            hero.bgImage ? 'text-slate-200' : 'text-body',
                            isMobilePreview ? 'text-xs' : 'text-sm sm:text-lg'
                          )}
                        >
                          {hero.subheadline}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>
              );
            }

            case 'intro_section': {
              const intro = content.intro;
              if (!intro) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'border border-line bg-surface/80 shadow-xs backdrop-blur-sm',
                      isMobilePreview ? 'rounded-xl p-4' : 'rounded-2xl p-6 sm:p-8'
                    )}
                  >
                    <div className="flex items-center gap-2 text-primary">
                      <InfoIcon className="h-4 w-4 shrink-0" />
                      <h2
                        className={cn(
                          'font-display font-semibold text-ink',
                          isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl'
                        )}
                      >
                        {intro.title}
                      </h2>
                    </div>
                    <p
                      className={cn(
                        'mt-2.5 whitespace-pre-line leading-relaxed text-body',
                        isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                      )}
                    >
                      {intro.description}
                    </p>
                  </div>
                </section>
              );
            }

            case 'interactive_grounding_tool': {
              const gt = content.groundingTool;
              if (!gt) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <InteractiveBreathingWidget
                    data={gt}
                    toneKey={resource.tone}
                    isMobilePreview={isMobilePreview}
                  />
                </section>
              );
            }

            case 'myths_vs_facts': {
              const mf = content.mythsFacts;
              if (!mf || !mf.items || mf.items.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <MythsVsFactsWidget
                    data={mf}
                    isMobilePreview={isMobilePreview}
                  />
                </section>
              );
            }

            case 'rich_text_jodit': {
              if (!content.richTextHtml) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'mha-prose border border-line bg-surface shadow-xs text-ink leading-relaxed overflow-x-auto',
                      isMobilePreview ? 'rounded-xl p-4 text-xs' : 'rounded-2xl p-6 sm:p-8'
                    )}
                    dangerouslySetInnerHTML={{ __html: content.richTextHtml }}
                  />
                </section>
              );
            }

            case 'symptoms_grid': {
              const symptoms = content.symptoms || [];
              if (symptoms.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className={isMobilePreview ? 'mb-3' : 'mb-5'}>
                    <h3
                      className={cn(
                        'font-display font-bold text-ink',
                        isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
                      )}
                    >
                      Common Experiences & Symptoms
                    </h3>
                    <p className="mt-0.5 text-[11px] text-subtle sm:text-sm">
                      Physical and mental indicators to recognize.
                    </p>
                  </div>
                  <div
                    className={cn(
                      'grid',
                      isMobilePreview
                        ? 'grid-cols-1 gap-2.5'
                        : 'grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3'
                    )}
                  >
                    {symptoms.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className={cn(
                          'rounded-xl border border-line bg-surface transition-all duration-150 hover:border-primary/50',
                          isMobilePreview ? 'p-3' : 'p-4'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary-tint text-[11px] font-bold text-primary">
                            {idx + 1}
                          </span>
                          <h4 className={cn('font-semibold text-ink', isMobilePreview ? 'text-xs' : 'text-sm')}>
                            {item.title}
                          </h4>
                        </div>
                        {item.description ? (
                          <p className="mt-1.5 text-[11.5px] leading-relaxed text-body">{item.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'warning_signs': {
              const signs = content.warningSigns || [];
              if (signs.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'border border-amber-500/20 bg-amber-500/5',
                      isMobilePreview ? 'rounded-xl p-4' : 'rounded-2xl p-5 sm:p-7'
                    )}
                  >
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <ShieldAlertIcon className="h-4 w-4 shrink-0" />
                      <h3 className={cn('font-display font-bold', isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl')}>
                        When to Seek Urgent Support
                      </h3>
                    </div>
                    <div
                      className={cn(
                        'mt-3 grid',
                        isMobilePreview ? 'grid-cols-1 gap-2' : 'grid-cols-1 gap-3 sm:grid-cols-2'
                      )}
                    >
                      {signs.map((sign, idx) => (
                        <div
                          key={sign.id || idx}
                          className={cn('rounded-lg border border-amber-500/20 bg-surface', isMobilePreview ? 'p-3' : 'p-3.5')}
                        >
                          <h4 className={cn('font-semibold text-ink', isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm')}>
                            {sign.title}
                          </h4>
                          {sign.description ? (
                            <p className="mt-1 text-[11px] text-body leading-relaxed">{sign.description}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            case 'info_cards': {
              const features = content.features || [];
              if (features.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'grid',
                      isMobilePreview ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 gap-4 sm:grid-cols-2'
                    )}
                  >
                    {features.map((card, idx) => (
                      <div
                        key={card.id || idx}
                        className={cn(
                          'rounded-xl border border-line bg-surface shadow-xs',
                          isMobilePreview ? 'p-3.5' : 'p-5 sm:p-6'
                        )}
                      >
                        <h4 className={cn('font-display font-semibold text-ink', isMobilePreview ? 'text-xs' : 'text-base sm:text-lg')}>
                          {card.title}
                        </h4>
                        {card.description ? (
                          <p className="mt-1.5 text-[11.5px] leading-relaxed text-body sm:text-sm">{card.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'image_text': {
              const it = content.imageText;
              if (!it) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'grid items-center rounded-xl border border-line bg-surface',
                      isMobilePreview
                        ? 'grid-cols-1 gap-3 p-4'
                        : 'grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8',
                      it.imagePosition === 'left' && !isMobilePreview ? 'sm:grid-flow-dense' : ''
                    )}
                  >
                    <div className={cn(it.imagePosition === 'left' && !isMobilePreview ? 'sm:col-start-2' : '')}>
                      {it.title ? (
                        <h3 className={cn('font-display font-bold text-ink', isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl')}>
                          {it.title}
                        </h3>
                      ) : null}
                      <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-body sm:text-sm">
                        {it.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'overflow-hidden rounded-lg border border-line shadow-xs',
                        it.imagePosition === 'left' && !isMobilePreview ? 'sm:col-start-1' : ''
                      )}
                    >
                      <img
                        src={it.imageUrl}
                        alt={it.title || 'Illustration'}
                        className={cn('w-full object-cover', isMobilePreview ? 'h-36' : 'h-56')}
                      />
                    </div>
                  </div>
                </section>
              );
            }

            case 'quote_callout': {
              const quote = content.quote;
              if (!quote || !quote.text) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'relative overflow-hidden border border-line bg-primary-tint/30 text-center',
                      isMobilePreview ? 'rounded-xl p-4' : 'rounded-2xl p-6 sm:p-10'
                    )}
                  >
                    <QuoteIcon className="mx-auto h-5 w-5 text-primary/40" />
                    <blockquote
                      className={cn(
                        'mt-2 font-display font-medium italic text-ink',
                        isMobilePreview ? 'text-xs leading-snug' : 'text-base sm:text-xl'
                      )}
                    >
                      “{quote.text}”
                    </blockquote>
                    {quote.author ? (
                      <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-wider text-primary sm:text-sm">
                        — {quote.author}
                      </p>
                    ) : null}
                  </div>
                </section>
              );
            }

            case 'coping_strategies': {
              const strategies = content.copingStrategies || [];
              if (strategies.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className={isMobilePreview ? 'mb-3' : 'mb-5'}>
                    <h3
                      className={cn(
                        'font-display font-bold text-ink',
                        isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
                      )}
                    >
                      Actionable Coping Tools
                    </h3>
                    <p className="mt-0.5 text-[11px] text-subtle sm:text-sm">Try one of these evidence-based techniques.</p>
                  </div>
                  <div
                    className={cn(
                      'grid',
                      isMobilePreview ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 gap-3.5 sm:grid-cols-3'
                    )}
                  >
                    {strategies.map((strat, idx) => (
                      <div
                        key={strat.id || idx}
                        className={cn(
                          'rounded-xl border border-line bg-surface shadow-xs transition-all',
                          isMobilePreview ? 'p-3.5' : 'p-5'
                        )}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-tint text-primary font-bold text-[11px]">
                          {idx + 1}
                        </div>
                        <h4 className={cn('mt-2 font-bold text-ink', isMobilePreview ? 'text-xs' : 'text-sm sm:text-base')}>
                          {strat.title}
                        </h4>
                        {strat.description ? (
                          <p className="mt-1 text-[11.5px] leading-relaxed text-body">{strat.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'treatment_options': {
              const options = content.treatmentOptions || [];
              if (options.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className={isMobilePreview ? 'mb-3' : 'mb-5'}>
                    <h3
                      className={cn(
                        'font-display font-bold text-ink',
                        isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
                      )}
                    >
                      Clinical Treatment Pathways
                    </h3>
                  </div>
                  <div
                    className={cn(
                      'grid',
                      isMobilePreview ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 gap-4 sm:grid-cols-2'
                    )}
                  >
                    {options.map((opt, idx) => (
                      <div
                        key={opt.id || idx}
                        className={cn(
                          'rounded-xl border border-line bg-surface shadow-xs',
                          isMobilePreview ? 'p-3.5' : 'p-5'
                        )}
                      >
                        <h4 className={cn('font-display font-semibold text-ink', isMobilePreview ? 'text-xs' : 'text-base')}>
                          {opt.title}
                        </h4>
                        {opt.description ? (
                          <p className="mt-1 text-[11.5px] leading-relaxed text-body">{opt.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            case 'supporting_someone': {
              const sup = content.supportingSomeone;
              if (!sup) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'border border-line bg-surface',
                      isMobilePreview ? 'rounded-xl p-4' : 'rounded-2xl p-6 sm:p-8'
                    )}
                  >
                    <h3 className={cn('font-display font-bold text-ink', isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl')}>
                      {sup.title}
                    </h3>
                    {sup.description ? (
                      <p className="mt-1.5 text-xs text-body leading-relaxed">{sup.description}</p>
                    ) : null}
                    {sup.tips && sup.tips.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {sup.tips.map((tip, idx) => (
                          <div
                            key={tip.id || idx}
                            className="flex items-start gap-2.5 rounded-lg border border-line bg-canvas/40 p-2.5"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold">
                              ✓
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-ink">{tip.title}</p>
                              {tip.description ? (
                                <p className="mt-0.5 text-[11px] text-body">{tip.description}</p>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            }

            case 'faq_accordion': {
              const faqs = content.accordionItems || [];
              if (faqs.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className={isMobilePreview ? 'mb-3' : 'mb-5'}>
                    <h3
                      className={cn(
                        'font-display font-bold text-ink',
                        isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
                      )}
                    >
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {faqs.map((faq, idx) => {
                      const id = faq.id || `faq-${idx}`;
                      const isOpen = Boolean(openFaqIds[id]);
                      return (
                        <div key={id} className="overflow-hidden rounded-lg border border-line bg-surface shadow-xs">
                          <button
                            type="button"
                            onClick={() => toggleFaq(id)}
                            className="flex w-full items-center justify-between gap-2 p-3 text-left font-medium text-ink transition-colors hover:bg-canvas/50"
                          >
                            <span className={cn('font-semibold', isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm')}>
                              {faq.question}
                            </span>
                            <ChevronDownIcon
                              className={cn('h-4 w-4 shrink-0 text-subtle transition-transform duration-200', isOpen ? 'rotate-180 text-primary' : '')}
                            />
                          </button>
                          {isOpen ? (
                            <div className="border-t border-line/60 bg-canvas/30 p-3 text-[11.5px] leading-relaxed text-body">
                              {faq.answer}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            case 'resource_links': {
              const resources = content.resources || [];
              if (resources.length === 0) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className={isMobilePreview ? 'mb-3' : 'mb-5'}>
                    <h3
                      className={cn(
                        'font-display font-bold text-ink',
                        isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
                      )}
                    >
                      Verified Helplines & Directories
                    </h3>
                  </div>
                  <div
                    className={cn(
                      'grid',
                      isMobilePreview ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 gap-3.5 sm:grid-cols-2'
                    )}
                  >
                    {resources.map((item, idx) => (
                      <a
                        key={item.id || idx}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          'group flex flex-col justify-between rounded-xl border border-line bg-surface transition-all duration-150 hover:border-primary',
                          isMobilePreview ? 'p-3' : 'p-4'
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className={cn('font-bold text-ink group-hover:text-primary', isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm')}>
                              {item.title}
                            </h4>
                            <ExternalLinkIcon className="h-3 w-3 text-subtle group-hover:text-primary" />
                          </div>
                          {item.description ? (
                            <p className="mt-1 text-[11px] text-body leading-relaxed">{item.description}</p>
                          ) : null}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-[10.5px] font-mono text-primary">
                          <span>{item.url.replace(/^https?:\/\//, '').replace(/^tel:/, 'Call: ').replace(/^sms:/, 'Text: ')}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </section>
              );
            }

            case 'crisis_banner': {
              const crisis = content.crisis;
              if (!crisis) return null;
              return (
                <section key={block.id || sIdx} className={isMobilePreview ? 'px-3.5' : 'px-4 sm:px-6'}>
                  <div
                    className={cn(
                      'mx-auto border border-rose-500/30 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent',
                      isMobilePreview ? 'rounded-xl p-4' : 'max-w-4xl rounded-2xl p-6 sm:p-8'
                    )}
                  >
                    <div
                      className={cn(
                        'flex gap-3',
                        isMobilePreview ? 'flex-col' : 'flex-col sm:flex-row sm:items-center sm:justify-between'
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <ShieldAlertIcon className="h-4 w-4 shrink-0" />
                          <h3 className={cn('font-display font-bold', isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl')}>
                            {crisis.title}
                          </h3>
                        </div>
                        <p className="text-xs text-body leading-relaxed max-w-xl">
                          {crisis.description}
                        </p>
                      </div>
                      <div className={cn('flex flex-wrap items-center gap-2', isMobilePreview ? 'w-full pt-1' : '')}>
                        <a
                          href={`tel:${crisis.emergencyNumber || '988'}`}
                          className={cn(
                            'inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-95',
                            isMobilePreview ? 'flex-1 py-2 text-xs' : 'px-4 py-2.5 text-xs'
                          )}
                        >
                          <PhoneCallIcon className="h-3.5 w-3.5" />
                          Call {crisis.emergencyNumber || '988'}
                        </a>
                        <a
                          href="sms:741741"
                          className={cn(
                            'inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-surface font-semibold text-rose-600 shadow-xs hover:bg-rose-50',
                            isMobilePreview ? 'flex-1 py-2 text-xs' : 'px-4 py-2.5 text-xs'
                          )}
                        >
                          <MessageSquareIcon className="h-3.5 w-3.5" />
                          Text 741741
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            case 'cta_banner': {
              const cta = content.cta;
              if (!cta) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div
                    className={cn(
                      'border border-primary/30 bg-primary-tint/40 text-center',
                      isMobilePreview ? 'rounded-xl p-4' : 'rounded-2xl p-6 sm:p-10'
                    )}
                  >
                    <h3 className={cn('font-display font-bold text-ink', isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl')}>
                      {cta.title}
                    </h3>
                    {cta.description ? (
                      <p className="mx-auto mt-1.5 max-w-lg text-xs leading-relaxed text-body">
                        {cta.description}
                      </p>
                    ) : null}
                    {cta.buttonText && cta.buttonLink ? (
                      <a
                        href={cta.buttonLink}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          'mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary font-semibold text-white shadow-xs hover:bg-primary-hover active:scale-95',
                          isMobilePreview ? 'w-full py-2 text-xs' : 'px-5 py-2.5 text-xs'
                        )}
                      >
                        <span>{cta.buttonText}</span>
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </section>
              );
            }

            case 'video': {
              const vid = content.video;
              if (!vid || !vid.videoUrl) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className="space-y-2">
                    {vid.title ? (
                      <h3 className={cn('font-display font-bold text-ink', isMobilePreview ? 'text-sm' : 'text-lg sm:text-xl')}>
                        {vid.title}
                      </h3>
                    ) : null}
                    {vid.description ? <p className="text-xs text-body">{vid.description}</p> : null}
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-line bg-black shadow-xs">
                      <iframe
                        src={vid.videoUrl}
                        title={vid.title || 'Video resource'}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </section>
              );
            }

            case 'disclaimer': {
              const disc = content.disclaimer;
              if (!disc || !disc.text) return null;
              return (
                <section key={block.id || sIdx} className={containerCls}>
                  <div className="rounded-lg border border-line bg-canvas/60 p-3 text-center">
                    <p className="text-[10.5px] leading-relaxed text-subtle sm:text-xs">
                      {disc.text}
                    </p>
                  </div>
                </section>
              );
            }

            default:
              return null;
          }
        })}
      </main>

      {/* Website Footer */}
      <footer className="border-t border-line/70 bg-surface py-6 text-center text-[11px] text-subtle">
        <div className={cn('mx-auto space-y-2', isMobilePreview ? 'px-3.5' : 'max-w-4xl px-4 sm:px-6')}>
          <p className="font-medium text-ink">Mental Health Support Resource</p>
          <p>Zero-retention confidential delivery.</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-rose-600 transition-colors"
            >
              <FlagIcon className="h-3.5 w-3.5" />
              <span>Report this transmission or opt out</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Recipient Report Modal */}
      {isReportModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Report Message"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  Report Received Message
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  If this message was unsolicited, harassing, or inappropriate, let our safety moderators know.
                </p>
              </div>
              <button
                type="button"
                onClick={resetReportForm}
                className="rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink transition-colors"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2Icon className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-ink text-base">Report Submitted</h4>
                <p className="text-xs text-body max-w-sm mx-auto leading-relaxed">
                  Thank you. Your report has been logged in the admin console. Our moderators review reports to suspend offending senders and maintain platform safety.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetReportForm}
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">
                    Reason Category *
                  </label>
                  <select
                    value={reportReasonCategory}
                    onChange={(e) => setReportReasonCategory(e.target.value as ReportReasonCategory)}
                    className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                  >
                    <option value="unsolicited">Unsolicited / Did Not Request This</option>
                    <option value="harassment">Harassment / Coercive or Abusive</option>
                    <option value="spam">Commercial Spam / Advertising Link</option>
                    <option value="distressing">Distressing / Uncomfortable Content</option>
                    <option value="wrong_number">Wrong Number / Recipient Mistake</option>
                    <option value="other">Other Concern</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">
                    Reason Details *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reportReasonText}
                    onChange={(e) => setReportReasonText(e.target.value)}
                    placeholder="Please provide details about what happened..."
                    className="w-full rounded-lg border border-line bg-surface p-2.5 text-xs text-ink leading-relaxed placeholder:text-subtle focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink">
                      Sender Name / Info (If known)
                    </label>
                    <input
                      type="text"
                      value={reportedPerson}
                      onChange={(e) => setReportedPerson(e.target.value)}
                      placeholder="e.g. John / anonymous"
                      className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink">
                      Channel
                    </label>
                    <select
                      value={reportChannel}
                      onChange={(e) => setReportChannel(e.target.value as 'sms' | 'email')}
                      className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                    >
                      <option value="sms">SMS Text Message</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink">
                    Your Phone or Email (Optional)
                  </label>
                  <input
                    type="text"
                    value={reporterContact}
                    onChange={(e) => setReporterContact(e.target.value)}
                    placeholder="To verify and block this sender from contacting you"
                    className="h-9 w-full rounded-lg border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-line/60">
                  <button
                    type="button"
                    onClick={resetReportForm}
                    className="rounded-xl border border-line bg-canvas px-4 py-2 text-xs font-medium text-body hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 active:scale-95 transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// -------------------------------------------------------------
// Interactive 4-7-8 & Grounding Breathing Pacer Component
// -------------------------------------------------------------
function InteractiveBreathingWidget({
  data,
  toneKey,
  isMobilePreview,
}: {
  data: IGroundingContent;
  toneKey?: string;
  isMobilePreview?: boolean;
}) {
  const technique = data.technique || '4-7-8';
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold_empty'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);

  const getTimings = () => {
    switch (technique) {
      case 'box_4_4_4_4':
        return { inhale: 4, hold: 4, exhale: 4, hold_empty: 4 };
      case 'calm_4_6':
        return { inhale: 4, hold: 0, exhale: 6, hold_empty: 0 };
      case '4-7-8':
      default:
        return { inhale: 4, hold: 7, exhale: 8, hold_empty: 0 };
    }
  };

  useEffect(() => {
    if (!running) return;

    const timings = getTimings();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition phases
        if (phase === 'inhale') {
          if (timings.hold > 0) {
            setPhase('hold');
            return timings.hold;
          } else {
            setPhase('exhale');
            return timings.exhale;
          }
        } else if (phase === 'hold') {
          setPhase('exhale');
          return timings.exhale;
        } else if (phase === 'exhale') {
          if (timings.hold_empty > 0) {
            setPhase('hold_empty');
            return timings.hold_empty;
          } else {
            setCycles((c) => c + 1);
            setPhase('inhale');
            return timings.inhale;
          }
        } else {
          setCycles((c) => c + 1);
          setPhase('inhale');
          return timings.inhale;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, phase, technique]);

  const handleToggle = () => {
    if (!running) {
      setPhase('inhale');
      setCountdown(getTimings().inhale);
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setPhase('inhale');
    setCountdown(getTimings().inhale);
    setCycles(0);
  };

  const getInstruction = () => {
    if (!running) return 'Press Start when you are ready to breathe';
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly through your nose...';
      case 'hold':
        return 'Hold your breath gently...';
      case 'exhale':
        return 'Exhale slowly through your mouth...';
      case 'hold_empty':
        return 'Rest comfortably...';
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-line bg-surface/90 shadow-sm text-center relative overflow-hidden',
        isMobilePreview ? 'p-4' : 'p-6 sm:p-8'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 text-left">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-tint text-primary">
            <WindIcon className="h-4 w-4" />
          </span>
          <div>
            <h3 className={cn('font-display font-bold text-ink', isMobilePreview ? 'text-xs' : 'text-base sm:text-lg')}>
              {data.title || 'Live Calming Breath Pacer'}
            </h3>
            <span className="text-[10px] font-mono text-subtle">
              Technique: {technique.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {cycles > 0 ? (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'} completed
          </span>
        ) : null}
      </div>

      {data.description ? (
        <p className="mt-3 text-xs text-body leading-relaxed max-w-lg mx-auto">
          {data.description}
        </p>
      ) : null}

      {/* Pulsing Breathing Circle */}
      <div className={cn('my-6 flex items-center justify-center', isMobilePreview ? 'my-4' : 'my-8')}>
        <div className="relative flex items-center justify-center">
          {/* Outer Ripple */}
          <div
            className={cn(
              'absolute rounded-full border border-primary/30 transition-all duration-1000 ease-in-out',
              isMobilePreview ? 'h-36 w-36' : 'h-48 w-48',
              running && phase === 'inhale' ? 'scale-125 opacity-100 bg-primary-tint/30' : '',
              running && phase === 'hold' ? 'scale-125 opacity-80 bg-primary-tint/40' : '',
              running && phase === 'exhale' ? 'scale-90 opacity-40 bg-primary-tint/10' : '',
              !running ? 'scale-100 opacity-20' : ''
            )}
          />

          {/* Inner Circle with Counter */}
          <div
            className={cn(
              'flex flex-col items-center justify-center rounded-full border-2 border-primary bg-surface shadow-md transition-transform duration-1000 ease-in-out z-10',
              isMobilePreview ? 'h-28 w-28' : 'h-36 w-36',
              running && phase === 'inhale' ? 'scale-110' : '',
              running && phase === 'hold' ? 'scale-110' : '',
              running && phase === 'exhale' ? 'scale-95' : ''
            )}
          >
            <span className="font-mono text-2xl font-extrabold text-primary sm:text-3xl">
              {running ? countdown : '4'}
            </span>
            <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
              {running ? phase.replace('_', ' ') : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Instruction */}
      <p className={cn('font-display font-medium text-ink transition-all', isMobilePreview ? 'text-xs' : 'text-sm sm:text-base')}>
        {getInstruction()}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-semibold text-white shadow-xs transition-all active:scale-95',
            running ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-hover',
            isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
          )}
        >
          {running ? <PauseIcon className="h-3.5 w-3.5" /> : <PlayIcon className="h-3.5 w-3.5" />}
          <span>{running ? 'Pause' : 'Start Breathing Exercise'}</span>
        </button>

        {(running || cycles > 0) ? (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-line bg-canvas px-3 py-2 text-xs font-medium text-subtle hover:text-ink transition-colors"
          >
            <RotateCcwIcon className="h-3 w-3" />
            <span>Reset</span>
          </button>
        ) : null}
      </div>

      {data.guidanceText ? (
        <p className="mt-4 border-t border-line/60 pt-3 text-[11px] text-subtle italic">
          {data.guidanceText}
        </p>
      ) : null}
    </div>
  );
}

// -------------------------------------------------------------
// Myths vs. Facts Comparison Component
// -------------------------------------------------------------
function MythsVsFactsWidget({
  data,
  isMobilePreview,
}: {
  data: IMythsFactsContent;
  isMobilePreview?: boolean;
}) {
  const items = data.items || [];

  return (
    <div className="space-y-4">
      <div className={isMobilePreview ? 'mb-2' : 'mb-4'}>
        <h3
          className={cn(
            'font-display font-bold text-ink',
            isMobilePreview ? 'text-sm' : 'text-xl sm:text-2xl'
          )}
        >
          {data.title || 'Myths vs. Clinical Realities'}
        </h3>
        {data.description ? (
          <p className="mt-0.5 text-[11px] text-subtle sm:text-sm">{data.description}</p>
        ) : null}
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className={cn(
              'grid rounded-xl border border-line bg-surface overflow-hidden shadow-xs',
              isMobilePreview ? 'grid-cols-1 divide-y divide-line' : 'grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-line'
            )}
          >
            {/* Myth Column */}
            <div className={cn('bg-rose-500/5 space-y-1.5', isMobilePreview ? 'p-3' : 'p-4')}>
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <XCircleIcon className="h-4 w-4 shrink-0" />
                <span className="text-[10.5px] font-bold uppercase tracking-wider">Myth</span>
              </div>
              <p className="text-xs font-medium text-ink leading-relaxed line-through decoration-rose-400/60">
                “{item.myth}”
              </p>
            </div>

            {/* Fact Column */}
            <div className={cn('bg-emerald-500/5 space-y-1.5', isMobilePreview ? 'p-3' : 'p-4')}>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                <span className="text-[10.5px] font-bold uppercase tracking-wider">Clinical Fact</span>
              </div>
              <p className="text-xs text-body leading-relaxed">
                {item.fact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
