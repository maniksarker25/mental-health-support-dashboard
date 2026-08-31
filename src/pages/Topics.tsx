import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LibraryIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  FileTextIcon,
  SparklesIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { TONE_KEYS, TONE_META } from '../data/topics';
import type { IAdminTopic, ToneKey } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge, ToneBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const AVAILABLE_ICONS = [
  'Wind',
  'CloudRain',
  'BatteryLow',
  'ShieldAlert',
  'HeartCrack',
  'Moon',
  'Users',
  'Repeat',
  'PillBottle',
  'Sparkles',
  'Heart',
  'Smile',
];

export function TopicsPage() {
  const navigate = useNavigate();
  const { adminTopics, saveAdminTopic, deleteAdminTopic, articleResources } = useAdminStore();
  const loading = useSimulatedLoad(400);
  const table = useTableState(8);

  const [toneFilter, setToneFilter] = useState<ToneKey | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | 'all'>('all');

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<IAdminTopic | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formTone, setFormTone] = useState<ToneKey>('sky');
  const [formIcon, setFormIcon] = useState('Wind');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');

  // Delete modal state
  const [deletingTopic, setDeletingTopic] = useState<IAdminTopic | null>(null);

  const openCreateModal = () => {
    setEditingTopic(null);
    setFormName('');
    setFormTone('sky');
    setFormIcon('Wind');
    setFormDescription('');
    setFormStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (topic: IAdminTopic) => {
    setEditingTopic(topic);
    setFormName(topic.name);
    setFormTone(topic.tone || 'sky');
    setFormIcon(topic.icon || 'Wind');
    setFormDescription(topic.description || '');
    setFormStatus(topic.status || 'published');
    setIsModalOpen(true);
  };

  const handleSaveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please provide a topic name.');
      return;
    }

    const topicData: IAdminTopic = {
      id: editingTopic ? editingTopic.id : `topic-${Date.now()}`,
      name: formName.trim(),
      tone: formTone,
      icon: formIcon,
      description: formDescription.trim(),
      status: formStatus,
      createdAt: editingTopic ? editingTopic.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAdminTopic(topicData);
    setIsModalOpen(false);
    toast.success(editingTopic ? 'Topic updated successfully!' : 'New topic created successfully!');
  };

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return adminTopics.filter((t) => {
      const matchesQuery =
        q.length === 0 ||
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q));

      const matchesTone = toneFilter === 'all' || t.tone === toneFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchesQuery && matchesTone && matchesStatus;
    });
  }, [adminTopics, table.query, toneFilter, statusFilter]);

  const page = paginate(filtered, table.page, table.pageSize);
  const publishedCount = adminTopics.filter((t) => t.status === 'published').length;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Topic Management"
        description={`${publishedCount} active topics, ${adminTopics.length - publishedCount} in draft. Topics categorize mental health guides and resources across the platform.`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/resources')}>
              <FileTextIcon className="h-4 w-4" />
              Manage Resources
            </Button>
            <Button onClick={openCreateModal}>
              <PlusIcon className="h-4 w-4" />
              Create New Topic
            </Button>
          </div>
        }
      />

      <Card>
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search topic name or keywords…"
            className="w-full sm:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[150px]">
              <Select
                value={toneFilter}
                onChange={(e) => setToneFilter(e.target.value as ToneKey | 'all')}
                aria-label="Filter by tone"
                className="h-9 text-[13px]"
              >
                <option value="all">All tones</option>
                {TONE_KEYS.map((tone) => (
                  <option key={tone} value={tone}>
                    {TONE_META[tone].label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-[150px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'published' | 'draft' | 'all')}
                aria-label="Filter by status"
                className="h-9 text-[13px]"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <p className="text-xs text-subtle ml-auto">
              {filtered.length} of {adminTopics.length} topics
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<LibraryIcon className="h-4 w-4" />}
            title="No topics match your filters"
            description="Try resetting your filters or create a new topic to get started."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setToneFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Topic Name</Th>
                  <Th>Visual Tone</Th>
                  <Th align="center">Articles</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((topic) => {
                  const isPublished = topic.status === 'published';
                  const attachedCount = articleResources.filter(
                    (r) => r.topicId === topic.id || r.topicName === topic.name
                  ).length;

                  return (
                    <tr
                      key={topic.id}
                      className="transition-colors duration-150 ease-calm hover:bg-canvas/70"
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                              TONE_META[topic.tone]?.chip || ''
                            )}
                          >
                            <DynamicIcon name={topic.icon || 'Wind'} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-medium text-ink">{topic.name}</p>
                            {topic.description ? (
                              <p className="line-clamp-1 text-[11.5px] text-subtle">{topic.description}</p>
                            ) : null}
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <ToneBadge tone={topic.tone} />
                      </Td>

                      <Td align="center">
                        <span className="inline-flex items-center gap-1 font-mono text-[12.5px] text-ink font-medium">
                          <FileTextIcon className="h-3.5 w-3.5 text-primary" />
                          {attachedCount}
                        </span>
                      </Td>

                      <Td>
                        <Badge tone={isPublished ? 'success' : 'warning'}>
                          {isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </Td>

                      <Td className="whitespace-nowrap text-[12.5px] text-subtle">
                        {relativeTime(topic.updatedAt)}
                      </Td>

                      <Td align="right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip label="Create Resource for this Topic">
                            <button
                              onClick={() => navigate(`/resources/new?topicId=${topic.id}`)}
                              aria-label={`Add article resource for ${topic.name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Edit Topic">
                            <button
                              onClick={() => openEditModal(topic)}
                              aria-label={`Edit ${topic.name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Delete Topic">
                            <button
                              onClick={() => setDeletingTopic(topic)}
                              aria-label={`Delete ${topic.name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-danger-bg hover:text-danger"
                            >
                              <Trash2Icon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableShell>

            <Pagination
              page={page.safePage}
              totalPages={page.totalPages}
              from={page.from}
              to={page.to}
              total={page.total}
              onPage={table.setPage}
              unit="topics"
            />
          </>
        )}
      </Card>

      {/* Create / Edit Topic Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTopic ? 'Edit Topic' : 'Create New Topic'}
        description={
          editingTopic
            ? 'Update the topic name, visual tone palette, icon, and publish status.'
            : 'Add a new topic for organizing clinically reviewed articles and resources.'
        }
      >
        <form onSubmit={handleSaveTopic} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Topic Name *
            </label>
            <Input
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Anxiety & Panic, Sleep Health"
              className="mt-1"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Visual Tone
              </label>
              <Select
                value={formTone}
                onChange={(e) => setFormTone(e.target.value as ToneKey)}
                className="mt-1"
              >
                {TONE_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {TONE_META[k].label} ({TONE_META[k].usage})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Icon
              </label>
              <Select
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                className="mt-1"
              >
                {AVAILABLE_ICONS.map((ico) => (
                  <option key={ico} value={ico}>
                    {ico}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Status
            </label>
            <Select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as 'published' | 'draft')}
              className="mt-1"
            >
              <option value="published">Published (Active)</option>
              <option value="draft">Draft (Hidden)</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Short Description / Summary
            </label>
            <Textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief summary of what this mental health topic covers…"
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTopic ? 'Save Changes' : 'Create Topic'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingTopic)}
        onClose={() => setDeletingTopic(null)}
        title="Delete this topic?"
        description={
          deletingTopic
            ? `Are you sure you want to delete “${deletingTopic.name}”?`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingTopic(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deletingTopic) return;
                deleteAdminTopic(deletingTopic.id);
                toast.success(`“${deletingTopic.name}” deleted`);
                setDeletingTopic(null);
              }}
            >
              Delete Topic
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          Deleting this topic will remove it from the active topic directory.
        </p>
      </Modal>
    </div>
  );
}