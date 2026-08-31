import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FileTextIcon,
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  EyeIcon,
  LayersIcon,
  ExternalLinkIcon,
  ClockIcon,
  SparklesIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { IArticleResource } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

export function ResourcesPage() {
  const navigate = useNavigate();
  const { articleResources, adminTopics, deleteArticleResource } = useAdminStore();
  const loading = useSimulatedLoad(400);
  const table = useTableState(8);

  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'published' | 'draft' | 'all'>('all');

  const [previewResource, setPreviewResource] = useState<IArticleResource | null>(null);
  const [deletingResource, setDeletingResource] = useState<IArticleResource | null>(null);

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return articleResources.filter((res) => {
      const topic = adminTopics.find((t) => t.id === res.topicId);
      const topicName = (res.topicName || topic?.name || '').toLowerCase();
      const title = res.title.toLowerCase();
      const desc = (res.shortDescription || '').toLowerCase();

      const matchesQuery =
        q.length === 0 ||
        title.includes(q) ||
        desc.includes(q) ||
        topicName.includes(q);

      const matchesTopic = topicFilter === 'all' || res.topicId === topicFilter;
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;

      return matchesQuery && matchesTopic && matchesStatus;
    });
  }, [articleResources, adminTopics, table.query, topicFilter, statusFilter]);

  const page = paginate(filtered, table.page, table.pageSize);
  const publishedCount = articleResources.filter((r) => r.status === 'published').length;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Resource & Article Management"
        description={`${publishedCount} published articles, ${articleResources.length - publishedCount} in draft. Create, edit, and curate full-text articles and guides using the Jodit editor.`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => navigate('/topics')}>
              <LayersIcon className="h-4 w-4" />
              Manage Topics
            </Button>
            <Button onClick={() => navigate('/resources/new')}>
              <PlusIcon className="h-4 w-4" />
              Create New Resource
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
            placeholder="Search article title or keywords…"
            className="w-full sm:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[180px]">
              <Select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                aria-label="Filter by topic"
                className="h-9 text-[13px]"
              >
                <option value="all">All Topics</option>
                {adminTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-[140px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'published' | 'draft' | 'all')}
                aria-label="Filter by status"
                className="h-9 text-[13px]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </Select>
            </div>

            <p className="text-xs text-subtle ml-auto">
              {filtered.length} of {articleResources.length} articles
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileTextIcon className="h-4 w-4" />}
            title="No resources match your filters"
            description="Create your first article guide using the Jodit editor or adjust your search filter."
            action={
              <Button onClick={() => navigate('/resources/new')}>
                <PlusIcon className="h-4 w-4" />
                Create New Resource
              </Button>
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Article / Resource Title</Th>
                  <Th>Assigned Topic</Th>
                  <Th>Read Time</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((res) => {
                  const topic = adminTopics.find((t) => t.id === res.topicId);
                  const isPublished = res.status === 'published';

                  return (
                    <tr
                      key={res.id}
                      className="transition-colors duration-150 ease-calm hover:bg-canvas/70"
                    >
                      <Td className="max-w-[360px]">
                        <div className="space-y-1">
                          <p className="line-clamp-1 text-[13.5px] font-semibold text-ink">
                            {res.title}
                          </p>
                          {res.shortDescription ? (
                            <p className="line-clamp-2 text-[12px] leading-relaxed text-body">
                              {res.shortDescription}
                            </p>
                          ) : null}
                        </div>
                      </Td>

                      <Td>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary">
                          <SparklesIcon className="h-3 w-3" />
                          {res.topicName || topic?.name || 'Unassigned'}
                        </span>
                      </Td>

                      <Td>
                        <span className="inline-flex items-center gap-1 text-xs text-body">
                          <ClockIcon className="h-3 w-3 text-subtle" />
                          {res.readingTime || 5} min
                        </span>
                      </Td>

                      <Td>
                        <Badge tone={isPublished ? 'success' : 'warning'}>
                          {isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </Td>

                      <Td className="whitespace-nowrap text-[12.5px] text-subtle">
                        {relativeTime(res.updatedAt)}
                      </Td>

                      <Td align="right">
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip label="Preview HTML Article">
                            <button
                              onClick={() => setPreviewResource(res)}
                              aria-label={`Preview ${res.title}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Edit in Jodit Editor">
                            <button
                              onClick={() => navigate(`/resources/edit/${res.id}`)}
                              aria-label={`Edit ${res.title}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <PencilIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          <Tooltip label="Delete Resource">
                            <button
                              onClick={() => setDeletingResource(res)}
                              aria-label={`Delete ${res.title}`}
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

      {/* Resource HTML Preview Modal */}
      {previewResource && (
        <Modal
          open={Boolean(previewResource)}
          onClose={() => setPreviewResource(null)}
          title={previewResource.title}
          description={`Topic: ${previewResource.topicName || 'General'} · ${previewResource.readingTime || 5} min read`}
        >
          <div className="space-y-4 pt-2">
            {previewResource.shortDescription && (
              <p className="rounded-xl border border-line bg-canvas p-3 text-xs leading-relaxed text-body italic">
                {previewResource.shortDescription}
              </p>
            )}

            <div
              className="max-h-[60vh] overflow-y-auto rounded-2xl border border-line bg-surface p-6 text-sm text-ink space-y-3"
              dangerouslySetInnerHTML={{ __html: previewResource.contentHtml || '<p>No content written yet.</p>' }}
            />

            <div className="flex justify-end pt-2">
              <Button onClick={() => setPreviewResource(null)}>Close Preview</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingResource)}
        onClose={() => setDeletingResource(null)}
        title="Delete this resource article?"
        description={
          deletingResource ? `Are you sure you want to delete “${deletingResource.title}”?` : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingResource(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deletingResource) return;
                deleteArticleResource(deletingResource.id);
                toast.success(`“${deletingResource.title}” deleted`);
                setDeletingResource(null);
              }}
            >
              Delete Resource
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          This article will be removed immediately from the public library.
        </p>
      </Modal>
    </div>
  );
}
