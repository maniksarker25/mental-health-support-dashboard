import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LibraryIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  FileTextIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { TONE_KEYS, TONE_META } from '../data/topics';
import type { IAdminTopic, ToneKey, TopicRecord } from '../types';
import {
  useCreateTopicMutation,
  useDeleteTopicMutation,
  useGetTopicsQuery,
  useUpdateTopicMutation,
} from '../redux/api/topicApi';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge, ToneBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { useTableState } from '../hooks/useTableState';
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

function toDashboardTopic(topic: TopicRecord): IAdminTopic {
  return {
    id: topic._id,
    name: topic.name,
    tone: topic.tone,
    icon: topic.icon,
    description: topic.shortDescription,
    status: 'published',
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  };
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null) {
    if ('data' in error && typeof error.data === 'object' && error.data !== null) {
      if ('message' in error.data && typeof error.data.message === 'string') {
        return error.data.message;
      }
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  return fallback;
}

export function TopicsPage() {
  const navigate = useNavigate();
  const { articleResources } = useAdminStore();
  const table = useTableState(8);

  const [toneFilter, setToneFilter] = useState<ToneKey | 'all'>('all');
  const {
    data: topicResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetTopicsQuery({
    page: table.page,
    limit: table.pageSize,
    ...(table.query.trim() ? { searchTerm: table.query.trim() } : {}),
    ...(toneFilter !== 'all' ? { tone: toneFilter } : {}),
  });
  const [createTopic, { isLoading: isCreating }] = useCreateTopicMutation();
  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();
  const [deleteTopic, { isLoading: isDeleting }] = useDeleteTopicMutation();
  const topics = topicResponse?.data.map(toDashboardTopic) ?? [];
  const totalTopics = topicResponse?.meta.total ?? 0;
  const totalPages = Math.max(1, topicResponse?.meta.totalPages ?? 1);
  const currentPage = topicResponse?.meta.page ?? table.page;
  const from = totalTopics === 0 ? 0 : (currentPage - 1) * table.pageSize + 1;
  const to = Math.min(currentPage * table.pageSize, totalTopics);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<IAdminTopic | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formTone, setFormTone] = useState<ToneKey>('sky');
  const [formIcon, setFormIcon] = useState('Wind');
  const [formDescription, setFormDescription] = useState('');

  // Delete modal state
  const [deletingTopic, setDeletingTopic] = useState<IAdminTopic | null>(null);

  const openCreateModal = () => {
    setEditingTopic(null);
    setFormName('');
    setFormTone('sky');
    setFormIcon('Wind');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (topic: IAdminTopic) => {
    setEditingTopic(topic);
    setFormName(topic.name);
    setFormTone(topic.tone || 'sky');
    setFormIcon(topic.icon || 'Wind');
    setFormDescription(topic.description || '');
    setIsModalOpen(true);
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Please provide a topic name.');
      return;
    }
    if (!formDescription.trim()) {
      toast.error('Please provide a short description.');
      return;
    }

    const body = {
      name: formName.trim(),
      tone: formTone,
      icon: formIcon,
      shortDescription: formDescription.trim(),
    };

    try {
      if (editingTopic) {
        await updateTopic({ id: editingTopic.id, body }).unwrap();
        toast.success('Topic updated successfully!');
      } else {
        await createTopic(body).unwrap();
        table.setPage(1);
        toast.success('New topic created successfully!');
      }
      setIsModalOpen(false);
    } catch (saveError) {
      toast.error(getApiErrorMessage(saveError, 'Could not save the topic.'));
    }
  };

  const handleDeleteTopic = async () => {
    if (!deletingTopic) return;
    try {
      await deleteTopic(deletingTopic.id).unwrap();
      toast.success(`“${deletingTopic.name}” deleted`);
      setDeletingTopic(null);
      table.setPage(1);
    } catch (deleteError) {
      toast.error(getApiErrorMessage(deleteError, 'Could not delete the topic.'));
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Topic Management"
        description={`${totalTopics} active topics. Topics categorize mental health guides and resources across the platform.`}
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
                onChange={(e) => {
                  setToneFilter(e.target.value as ToneKey | 'all');
                  table.setPage(1);
                }}
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

            <p className="text-xs text-subtle ml-auto">
              {topics.length} of {totalTopics} topics
            </p>
          </div>
        </div>

        {isLoading || isFetching ? (
          <TableSkeleton rows={6} columns={5} />
        ) : isError ? (
          <EmptyState
            icon={<LibraryIcon className="h-4 w-4" />}
            title="Could not load topics"
            description={getApiErrorMessage(error, 'Check the API connection and try again.')}
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : topics.length === 0 ? (
          <EmptyState
            icon={<LibraryIcon className="h-4 w-4" />}
            title={table.query || toneFilter !== 'all' ? 'No topics match your filters' : 'No topics yet'}
            description="Try resetting your filters or create a new topic to get started."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setToneFilter('all');
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
                {topics.map((topic) => {
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
                        <Badge tone="success">Active</Badge>
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
              page={currentPage}
              totalPages={totalPages}
              from={from}
              to={to}
              total={totalTopics}
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
            ? 'Update the topic name, visual tone, icon, and short description.'
            : 'Add a topic for organizing mental health guides and resources.'
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
              Short Description / Summary *
            </label>
            <Textarea
              required
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
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? 'Saving…'
                : editingTopic
                  ? 'Save Changes'
                  : 'Create Topic'}
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
              onClick={handleDeleteTopic}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete Topic'}
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