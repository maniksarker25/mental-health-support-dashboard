import React, { useState } from 'react';
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CopyIcon,
  Trash2Icon,
  SparklesIcon,
  LayoutGridIcon,
  SlidersIcon,
  EyeIcon,
  LayersIcon,
} from 'lucide-react';
import type { IResourceBlock, ResourceBlockType, ResourceLayoutStyle } from '../../types';
import { BLOCK_TYPE_META, LAYOUT_STYLE_OPTIONS, createDefaultBlock } from '../../data/topics';
import { Button } from '../ui/Button';
import { Select } from '../ui/Field';
import { SectionBlockEditor } from './SectionBlockEditor';
import { Modal } from '../ui/Sheet';
import { cn } from '../../utils/cn';

interface SectionListBuilderProps {
  sections: IResourceBlock[];
  onChange: (sections: IResourceBlock[]) => void;
}

export function SectionListBuilder({ sections, onChange }: SectionListBuilderProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id || null);

  const handleAddBlock = (type: ResourceBlockType) => {
    const newBlock = createDefaultBlock(type, sections.length);
    const updated = [...sections, newBlock];
    onChange(updated);
    setExpandedId(newBlock.id || null);
    setAddModalOpen(false);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // re-index order
    const finalized = reordered.map((sec, idx) => ({ ...sec, order: idx }));
    onChange(finalized);
  };

  const duplicateBlock = (index: number) => {
    const target = sections[index];
    const clone: IResourceBlock = {
      ...target,
      id: `blk-${Math.random().toString(36).slice(2, 9)}`,
      order: index + 1,
      content: JSON.parse(JSON.stringify(target.content)),
    };
    const next = [...sections.slice(0, index + 1), clone, ...sections.slice(index + 1)].map((sec, idx) => ({
      ...sec,
      order: idx,
    }));
    onChange(next);
    setExpandedId(clone.id || null);
  };

  const removeBlock = (index: number) => {
    const next = sections.filter((_, i) => i !== index).map((sec, idx) => ({ ...sec, order: idx }));
    onChange(next);
  };

  const updateBlock = (index: number, updated: IResourceBlock) => {
    const next = sections.map((sec, i) => (i === index ? updated : sec));
    onChange(next);
  };

  const allBlockTypes = Object.keys(BLOCK_TYPE_META) as ResourceBlockType[];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <h4 className="text-sm font-semibold text-ink">Modular Website Content Sections</h4>
          <p className="text-xs text-body">
            Build the recipient’s public web page by combining and styling any of the 18 content blocks.
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => setAddModalOpen(true)}>
          <PlusIcon className="h-4 w-4" />
          Add Section Block
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-canvas/40 p-8 text-center">
          <LayersIcon className="h-8 w-8 text-subtle" />
          <h5 className="mt-2 text-sm font-medium text-ink">No content sections added yet</h5>
          <p className="mt-1 max-w-sm text-xs text-body">
            Add your first section like a Hero Header, Intro Summary, or Coping Strategies.
          </p>
          <Button type="button" size="sm" className="mt-4" onClick={() => setAddModalOpen(true)}>
            <PlusIcon className="h-3.5 w-3.5" />
            Add First Section
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((block, idx) => {
            const meta = BLOCK_TYPE_META[block.blockType] || {
              label: block.blockType,
              description: '',
              icon: 'Box',
            };
            const isExpanded = expandedId === block.id;

            return (
              <div
                key={block.id || idx}
                className={cn(
                  'overflow-hidden rounded-xl border transition-all duration-150',
                  isExpanded ? 'border-primary/40 bg-surface shadow-sm' : 'border-line bg-surface/70 hover:border-line-hover'
                )}
              >
                {/* Section Item Header */}
                <div
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 bg-canvas/30 px-4 py-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : block.id || null)}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-tint font-mono text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">{meta.label}</span>
                        <span className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[10.5px] text-subtle border border-line">
                          {block.layoutStyle || 'default'}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-[11.5px] text-subtle">{meta.description}</p>
                    </div>
                  </div>

                  {/* Actions toolbar */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveBlock(idx, 'up')}
                      title="Move Up"
                      className="rounded p-1.5 text-body hover:bg-canvas disabled:opacity-30"
                    >
                      <ChevronUpIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => moveBlock(idx, 'down')}
                      title="Move Down"
                      className="rounded p-1.5 text-body hover:bg-canvas disabled:opacity-30"
                    >
                      <ChevronDownIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateBlock(idx)}
                      title="Duplicate Section"
                      className="rounded p-1.5 text-body hover:bg-canvas"
                    >
                      <CopyIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      title="Delete Section"
                      className="rounded p-1.5 text-body hover:bg-danger-bg hover:text-danger"
                    >
                      <Trash2Icon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section Content & Layout Editor Body */}
                {isExpanded ? (
                  <div className="space-y-4 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-canvas/40 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <LayoutGridIcon className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-ink">Section Layout Container</span>
                      </div>
                      <div className="w-56">
                        <Select
                          value={block.layoutStyle || 'default'}
                          onChange={(e) =>
                            updateBlock(idx, {
                              ...block,
                              layoutStyle: e.target.value as ResourceLayoutStyle,
                            })
                          }
                          className="h-8 text-xs"
                        >
                          {LAYOUT_STYLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    <SectionBlockEditor block={block} onChange={(updated) => updateBlock(idx, updated)} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Section Type Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Content Section to Resource"
        description="Choose from any of the 18 specialized mental health content block types."
        width="max-w-3xl"
        footer={
          <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[60vh] overflow-y-auto pr-1">
          {allBlockTypes.map((type) => {
            const meta = BLOCK_TYPE_META[type];
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleAddBlock(type)}
                className="group flex flex-col items-start rounded-xl border border-line bg-surface p-3.5 text-left transition-all duration-150 ease-calm hover:border-primary hover:bg-primary-tint/20 hover:shadow-sm"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-ink group-hover:text-primary">{meta.label}</span>
                  <PlusIcon className="h-3.5 w-3.5 text-subtle group-hover:text-primary" />
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-body">{meta.description}</p>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
