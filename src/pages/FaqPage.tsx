import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  HelpCircleIcon,
  PlusIcon,
  Trash2Icon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SaveIcon,
  SearchIcon,
  MessageSquareIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { SectionTitle, Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label, Textarea } from '../components/ui/Field';
import { cn } from '../utils/cn';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Will the recipient know who sent this resource?',
    answer:
      'No. Your name, phone number, and email never appear in the delivery message or headers. The resource packet arrives completely anonymously from our verified system.',
  },
  {
    id: 'faq-2',
    question: 'Is any personal data or browsing tracked when reading?',
    answer:
      'No. We operate on a strict zero-retention architecture. No IP addresses, phone numbers, or reading telemetry are recorded or retained.',
  },
  {
    id: 'faq-3',
    question: 'Can the recipient reply back to me?',
    answer:
      'No. All packet deliveries are one-directional by design to ensure complete privacy and prevent tracing.',
  },
  {
    id: 'faq-4',
    question: 'Is this service free for senders and receivers?',
    answer:
      'Yes. Mental Health Anonymous is completely free for everyone. It is supported through community grants and non-profit donations, never data monetization.',
  },
  {
    id: 'faq-5',
    question: 'Who writes and reviews the clinical resources?',
    answer:
      'Every resource packet is authored alongside licensed clinical psychologists (PsyD/MD/LCSW) and reviewed bi-annually against clinical benchmarks.',
  },
  {
    id: 'faq-6',
    question: 'What should I do if someone is in immediate danger?',
    answer:
      'Do not rely on educational reading in an acute emergency. Call or text 988 (Suicide & Crisis Lifeline) or contact 911 immediately.',
  },
];

export function FaqPage() {
  const { saveLegalDoc } = useAdminStore();
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const saved = localStorage.getItem('mha_faqs_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_FAQS;
      }
    }
    return DEFAULT_FAQS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [openPreviewIds, setOpenPreviewIds] = useState<Record<string, boolean>>({ 'faq-1': true });
  const [dirty, setDirty] = useState(false);

  const updateFaq = (index: number, patch: Partial<FaqItem>) => {
    setFaqs((prev) => {
      const next = prev.map((item, i) => (i === index ? { ...item, ...patch } : item));
      return next;
    });
    setDirty(true);
  };

  const addFaq = () => {
    const newId = `faq-${Date.now()}`;
    setFaqs((prev) => [
      ...prev,
      {
        id: newId,
        question: '',
        answer: '',
      },
    ]);
    setDirty(true);
    setOpenPreviewIds((prev) => ({ ...prev, [newId]: true }));
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
    setDirty(true);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFaqs((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setDirty(true);
  };

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    setFaqs((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setDirty(true);
  };

  const handleSave = () => {
    const validFaqs = faqs.filter((f) => f.question.trim().length > 0);
    localStorage.setItem('mha_faqs_data', JSON.stringify(validFaqs));

    // Also compile to HTML for store backward compatibility
    const compiledHtml = `<h2>Frequently Asked Questions</h2>${validFaqs
      .map((f) => `<h3>${f.question}</h3><p>${f.answer}</p>`)
      .join('')}`;
    saveLegalDoc('faq', compiledHtml);

    setDirty(false);
    toast.success('Frequently Asked Questions published successfully.');
  };

  const togglePreview = (id: string) => {
    setOpenPreviewIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = faqs.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Frequently Asked Questions (FAQ)"
        description="Add, edit, and organize questions and answers displayed in the mobile app help center and web knowledge base."
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={addFaq}>
              <PlusIcon className="h-4 w-4" />
              Add Question
            </Button>
            <Button onClick={handleSave} disabled={!dirty}>
              <SaveIcon className="h-4 w-4" />
              {dirty ? 'Save & Publish' : 'Saved'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left Column: Pure Question & Answer Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xs">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or answers..."
                className="w-full rounded-xl border border-line bg-canvas pl-9 pr-3 py-2 text-xs text-ink placeholder:text-subtle focus:border-primary focus:outline-hidden"
              />
            </div>
            <span className="text-xs text-subtle font-medium">
              {faqs.length} {faqs.length === 1 ? 'Question' : 'Questions'}
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredFaqs.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquareIcon className="mx-auto h-8 w-8 text-subtle" />
                <p className="mt-2 text-sm font-semibold text-ink">No questions found</p>
                <p className="text-xs text-subtle mt-1">Try a different search term or add a new question.</p>
                <Button size="sm" variant="secondary" onClick={addFaq} className="mt-4">
                  <PlusIcon className="h-3.5 w-3.5" /> Add Question
                </Button>
              </Card>
            ) : (
              filteredFaqs.map((item, idx) => {
                const originalIndex = faqs.findIndex((f) => f.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-xs space-y-3 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between border-b border-line pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary-tint text-[11px] font-bold text-primary font-mono">
                          Q{originalIndex + 1}
                        </span>
                        <span className="text-xs font-semibold text-ink">Question Item</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveUp(originalIndex)}
                          disabled={originalIndex === 0}
                          className="rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
                          title="Move up"
                        >
                          <ArrowUpIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDown(originalIndex)}
                          disabled={originalIndex === faqs.length - 1}
                          className="rounded-lg p-1.5 text-subtle hover:bg-canvas hover:text-ink disabled:opacity-30 disabled:pointer-events-none"
                          title="Move down"
                        >
                          <ArrowDownIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFaq(originalIndex)}
                          className="rounded-lg p-1.5 text-subtle hover:bg-danger-bg hover:text-danger ml-1"
                          title="Delete question"
                        >
                          <Trash2Icon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`q-${item.id}`}>Question</Label>
                        <Input
                          id={`q-${item.id}`}
                          value={item.question}
                          onChange={(e) => updateFaq(originalIndex, { question: e.target.value })}
                          placeholder="e.g. Will the recipient know who sent this?"
                          className="text-xs font-medium"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`a-${item.id}`}>Answer</Label>
                        <Textarea
                          id={`a-${item.id}`}
                          rows={3}
                          value={item.answer}
                          onChange={(e) => updateFaq(originalIndex, { answer: e.target.value })}
                          placeholder="Clear, helpful, and empathetic answer..."
                          className="text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredFaqs.length > 0 && (
            <Button variant="secondary" onClick={addFaq} className="w-full py-2.5">
              <PlusIcon className="h-4 w-4" />
              Add Another Question
            </Button>
          )}
        </div>

        {/* Right Column: Live Interactive Accordion Preview (5 Cols, Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Accordion Preview</span>
            </h3>
            <span className="text-[11px] font-mono text-subtle">Mobile View</span>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary border-b border-line pb-3">
              <HelpCircleIcon className="h-4 w-4" />
              <span className="font-display text-sm font-bold text-ink">Help Center & FAQ</span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {faqs.map((faq, idx) => {
                const isOpen = Boolean(openPreviewIds[faq.id]);
                const displayQuestion = faq.question.trim() || `Untitled Question #${idx + 1}`;
                const displayAnswer = faq.answer.trim() || 'No answer entered yet.';

                return (
                  <div key={faq.id} className="overflow-hidden rounded-xl border border-line bg-canvas/70 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => togglePreview(faq.id)}
                      className="flex w-full items-center justify-between gap-3 p-3.5 text-left font-medium text-ink hover:bg-surface transition-colors"
                    >
                      <span className="text-xs font-semibold leading-snug">{displayQuestion}</span>
                      <ChevronDownIcon
                        className={cn(
                          'h-4 w-4 shrink-0 text-subtle transition-transform duration-200',
                          isOpen ? 'rotate-180 text-primary' : ''
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-line/60 bg-surface/50 p-3.5 text-xs leading-relaxed text-body">
                        {displayAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
