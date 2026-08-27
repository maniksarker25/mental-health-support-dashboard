import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CopyIcon,
  LibraryIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  EyeIcon,
  LinkIcon,
  ShieldCheckIcon,
  LayersIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import { TONE_KEYS, TONE_META } from '../data/topics';
import type { PublishStatus, ToneKey, TopicAndResource } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge, ToneBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { WebsitePreviewModal } from '../components/topics/WebsitePreviewModal';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

export function TopicsPage() {
  const navigate = useNavigate();
  const { topics, saveTopic, deleteTopic, } = useAdminStore();
  const loading = useSimulatedLoad(500);
  const table = useTableState(6);

  const [toneFilter, setToneFilter] = useState<ToneKey | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PublishStatus | 'all'>('all');

  const [previewing, setPreviewing] = useState<TopicAndResource | null>(null);
  const [deleting, setDeleting] = useState<TopicAndResource | null>(null);

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return topics.filter((topic) => {
      const topicName = (topic.topicTitle || topic.title || '').toLowerCase();
      const resName = (topic.resourceTitle || topic.packetTitle || '').toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        topicName.includes(q) ||
        resName.includes(q);

      const matchesTone = toneFilter === 'all' || topic.tone === toneFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        topic.status === statusFilter ||
        (statusFilter === 'published' && topic.isPublished) ||
        (statusFilter === 'draft' && !topic.isPublished);

      return matchesQuery && matchesTone && matchesStatus;
    });
  }, [topics, table.query, toneFilter, statusFilter]);

  const page = paginate(filtered, table.page, table.pageSize);
  const publishedCount = topics.filter((t) => t.status === 'published' || t.isPublished).length;

  const handleCopyLink = (topic: TopicAndResource) => {
    const url = `${window.location.origin}/resource/${topic.id}`;
    navigator.clipboard.writeText(url);
    toast.success(`Copied receiver link for “${topic.topicTitle || topic.title}”`);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Topics & Resource Webpages"
        description={`${publishedCount} published, ${topics.length - publishedCount} in draft. Users select a topic in the app to dispatch an empathetic, multi-section web resource to their loved one.`}
        action={
          <Button onClick={() => navigate('/topics/new')}>
            <PlusIcon className="h-4 w-4" />
            New Topic & Resource
          </Button>
        }
      />

      <Card>
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search topic or headline"
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
                onChange={(e) => setStatusFilter(e.target.value as PublishStatus | 'all')}
                aria-label="Filter by status"
                className="h-9 text-[13px]"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <p className="text-xs text-subtle ml-auto">
              {filtered.length} of {topics.length} resources
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<LibraryIcon className="h-4 w-4" />}
            title="No topics match your filters"
            description="Try resetting your tone or search filters to see all available resources."
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
                  <Th>Topic</Th>
                  <Th>Tone</Th>
                  <Th>Resource Webpage</Th>
                  <Th align="center">Sections</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((topic) => {
                  const name = topic.topicTitle || topic.title || 'Untitled';
                  const resHeadline = topic.resourceTitle || topic.packetTitle || name;
                  const sectionsCount = (topic.sections || []).length;
                  const isPublished = topic.status === 'published' || topic.isPublished;

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
                            <DynamicIcon name={topic.icon || 'Leaf'} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-medium text-ink">{name}</p>
                            {topic.shortDescription ? (
                              <p className="line-clamp-1 text-[11.5px] text-subtle">{topic.shortDescription}</p>
                            ) : null}
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <ToneBadge tone={topic.tone} />
                      </Td>

                      <Td className="max-w-[300px]">
                        <div className="space-y-0.5">
                          <p className="line-clamp-1 text-[13px] font-medium text-ink">{resHeadline}</p>
                          <p className="line-clamp-1 font-mono text-[11px] text-primary">
                            /resource/{topic.id}
                          </p>
                        </div>
                      </Td>

                      <Td align="center">
                        <span className="inline-flex items-center gap-1 font-mono text-[12.5px] text-ink">
                          <LayersIcon className="h-3 w-3 text-subtle" />
                          {sectionsCount}
                        </span>
                      </Td>

                      <Td>
                        <Badge tone={isPublished ? 'success' : 'warning'}>
                          {isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </Td>

                      <Td className="whitespace-nowrap text-[12.5px] text-subtle">
                        {relativeTime(topic.updatedAt as string)}
                      </Td>

                      <Td align="right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip label="Preview Website (Desktop & Mobile)">
                            <button
                              onClick={() => setPreviewing(topic)}
                              aria-label={`Preview ${name} website`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Copy Public Link">
                            <button
                              onClick={() => handleCopyLink(topic)}
                              aria-label={`Copy link for ${name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Edit Topic & Sections">
                            <button
                              onClick={() => navigate(`/topics/edit/${topic.id}`)}
                              aria-label={`Edit ${name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Delete">
                            <button
                              onClick={() => setDeleting(topic)}
                              aria-label={`Delete ${name}`}
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
              unit="resources"
            />
          </>
        )}
      </Card>

      {/* Interactive Responsive Website Preview (Laptop / Tablet / Mobile) */}
      <WebsitePreviewModal
        open={Boolean(previewing)}
        resource={previewing}
        onClose={() => setPreviewing(null)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this topic & resource?"
        description={
          deleting
            ? `“${deleting.topicTitle || deleting.title}” will be removed immediately.`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deleting) return;
                deleteTopic(deleting.id);
                toast.success(`“${deleting.topicTitle || deleting.title}” deleted`);
                setDeleting(null);
              }}
            >
              Delete resource
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          Any recipient who already received this resource link will see a gentle sunset notice.
        </p>
      </Modal>
    </div>
  );
}