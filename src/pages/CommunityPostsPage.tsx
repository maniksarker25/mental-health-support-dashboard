import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  MessageSquarePlusIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  SearchIcon,
  Trash2Icon,
  EyeIcon,
  SparklesIcon,
  MessageCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SendIcon,
  ImageIcon,
  XIcon,
  CheckIcon,
  RotateCcwIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { IAdminCommunityPost, CommunityPostApprovalStatus } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select, Textarea } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const REJECTION_REASONS = [
  'Contains unverified commercial promo or medical sales claims',
  'Requests or offers specific prescription drug brand/dosage recommendations',
  'Violates community safety rules regarding harassment or offensive language',
  'Contains personally identifiable contact information or phone numbers',
  'Off-topic or spam content',
  'Other clinical safety concern',
];

const FEEDBACK_PRESETS = [
  'Please rephrase your question to discuss general coping strategies rather than specific prescription dosages.',
  'Please remove personal names or phone numbers before publishing to protect anonymous privacy.',
  'Please provide a bit more context on what you are experiencing so peers can share relevant suggestions.',
  'Please update your post title to be more specific to your question.',
];

export function CommunityPostsPage() {
  const {
    communityPosts,
    approveCommunityPost,
    rejectCommunityPost,
    sendFeedbackCommunityPost,
    deleteCommunityPost,
    approveAllPendingCommunityPosts,
  } = useAdminStore();

  const loading = useSimulatedLoad(400);
  const table = useTableState(8);

  const [statusFilter, setStatusFilter] = useState<CommunityPostApprovalStatus | 'all'>('all');

  // Modals state
  const [feedbackPost, setFeedbackPost] = useState<IAdminCommunityPost | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const [rejectingPost, setRejectingPost] = useState<IAdminCommunityPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState(REJECTION_REASONS[0]);
  const [customRejectionText, setCustomRejectionText] = useState('');

  const [deletingPost, setDeletingPost] = useState<IAdminCommunityPost | null>(null);
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const [inspectPost, setInspectPost] = useState<IAdminCommunityPost | null>(null);

  // Stats
  const totalCount = communityPosts.length;
  const pendingCount = communityPosts.filter((p) => p.status === 'pending').length;
  const approvedCount = communityPosts.filter((p) => p.status === 'approved').length;
  const needsUpdateCount = communityPosts.filter((p) => p.status === 'needs_update').length;
  const rejectedCount = communityPosts.filter((p) => p.status === 'rejected').length;

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return communityPosts.filter((p) => {
      const title = p.title.toLowerCase();
      const content = p.content.toLowerCase();
      const author = p.author.toLowerCase();
      const tag = p.topicTag.toLowerCase();

      const matchesQuery =
        q.length === 0 ||
        title.includes(q) ||
        content.includes(q) ||
        author.includes(q) ||
        tag.includes(q);

      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [communityPosts, table.query, statusFilter]);

  const page = paginate(filtered, table.page, table.pageSize);

  const handleApprove = (post: IAdminCommunityPost) => {
    approveCommunityPost(post.id);
    toast.success(`Post by “${post.author}” has been approved and published to the community!`);
  };

  const handleOpenFeedbackModal = (post: IAdminCommunityPost) => {
    setFeedbackPost(post);
    setFeedbackText(post.feedback || FEEDBACK_PRESETS[0]);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackPost) return;
    if (!feedbackText.trim()) {
      toast.error('Please enter the feedback instructions for the user.');
      return;
    }

    sendFeedbackCommunityPost(feedbackPost.id, feedbackText.trim());
    toast.success(`Feedback sent to “${feedbackPost.author}”. Post status set to Needs Update.`);
    setFeedbackPost(null);
    setFeedbackText('');
  };

  const handleOpenRejectModal = (post: IAdminCommunityPost) => {
    setRejectingPost(post);
    setRejectionReason(REJECTION_REASONS[0]);
    setCustomRejectionText('');
  };

  const handleSubmitReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPost) return;

    const reason =
      rejectionReason === 'Other clinical safety concern' && customRejectionText.trim()
        ? customRejectionText.trim()
        : rejectionReason;

    rejectCommunityPost(rejectingPost.id, reason);
    toast.error(`Post by “${rejectingPost.author}” has been rejected.`);
    setRejectingPost(null);
  };

  const handleBatchApprove = () => {
    const count = approveAllPendingCommunityPosts();
    if (count > 0) {
      toast.success(`Approved and published ${count} pending community posts.`);
    } else {
      toast.info('No pending community posts to approve.');
    }
  };

  const renderStatusBadge = (status: CommunityPostApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <Badge tone="success">Approved & Live</Badge>;
      case 'pending':
        return <Badge tone="warning">Pending Review</Badge>;
      case 'needs_update':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-0.5 text-xs font-semibold">
            Needs Update
          </span>
        );
      case 'rejected':
        return <Badge tone="danger">Rejected</Badge>;
      default:
        return <Badge tone="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Section Header */}
      <SectionTitle
        title="Community Post Moderation"
        description="Review community questions and user posts. Approve appropriate content, send feedback for updates, or reject policy-violating submissions."
        action={
          pendingCount > 0 ? (
            <Button onClick={handleBatchApprove}>
              <CheckCircle2Icon className="h-4 w-4" />
              Approve All Pending ({pendingCount})
            </Button>
          ) : undefined
        }
      />

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-4 text-left transition-all',
            statusFilter === 'all'
              ? 'border-primary bg-primary-tint/30 ring-1 ring-primary'
              : 'border-line bg-surface hover:border-primary/40'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-subtle">Total Discussions</span>
            <MessageCircleIcon className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-ink">{totalCount}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-4 text-left transition-all',
            statusFilter === 'pending'
              ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500'
              : 'border-line bg-surface hover:border-amber-400'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400 font-semibold">
              Pending Review
            </span>
            <ClockIcon className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-amber-700 dark:text-amber-400">
            {pendingCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('needs_update')}
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-4 text-left transition-all',
            statusFilter === 'needs_update'
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
              : 'border-line bg-surface hover:border-indigo-400'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300 font-semibold">
              Feedback Sent
            </span>
            <AlertCircleIcon className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-indigo-700 dark:text-indigo-300">
            {needsUpdateCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-4 text-left transition-all',
            statusFilter === 'approved'
              ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
              : 'border-line bg-surface hover:border-emerald-400'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 font-semibold">
              Approved & Live
            </span>
            <CheckCircle2Icon className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-3 text-2xl font-bold font-display text-emerald-700 dark:text-emerald-400">
            {approvedCount}
          </p>
        </button>
      </div>

      <Card>
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search post title, author, or question content…"
            className="w-full sm:w-96"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[180px]">
              <Select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as CommunityPostApprovalStatus | 'all')
                }
                aria-label="Filter by approval status"
                className="h-9 text-[13px]"
              >
                <option value="all">All Moderation Status</option>
                <option value="pending">Pending Review ({pendingCount})</option>
                <option value="needs_update">Feedback Sent ({needsUpdateCount})</option>
                <option value="approved">Approved ({approvedCount})</option>
                <option value="rejected">Rejected ({rejectedCount})</option>
              </Select>
            </div>

            <p className="text-xs text-subtle ml-auto">
              {filtered.length} of {communityPosts.length} posts
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquarePlusIcon className="h-4 w-4" />}
            title="No community posts match your criteria"
            description="All pending community submissions have been moderated or match no search terms."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setStatusFilter('all');
                }}
              >
                Reset Filters
              </Button>
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Author & Time</Th>
                  <Th>Question / Post Details</Th>
                  <Th>Image</Th>
                  <Th>Status</Th>
                  <Th align="right">Moderation Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((post) => {
                  return (
                    <tr
                      key={post.id}
                      className={cn(
                        'transition-colors duration-150 ease-calm hover:bg-canvas/70',
                        post.status === 'pending' && 'bg-amber-500/5'
                      )}
                    >
                      {/* Author & Time */}
                      <Td className="whitespace-nowrap align-top">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint font-bold text-xs text-primary">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-ink">{post.author}</p>
                            <p className="text-[11px] text-subtle">{relativeTime(post.createdAt)}</p>
                          </div>
                        </div>
                      </Td>

                      {/* Title, Content & Feedback Note */}
                      <Td className="max-w-[420px] align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="rounded-full border border-line bg-canvas px-2.5 py-0.5 text-[11px] font-medium text-body">
                              {post.topicTag}
                            </span>
                            {post.likes > 0 && (
                              <span className="text-[11px] text-subtle">
                                ❤️ {post.likes} helpful
                              </span>
                            )}
                          </div>

                          <p className="text-[13.5px] font-bold text-ink leading-snug">
                            {post.title}
                          </p>

                          <p className="line-clamp-2 text-[12px] leading-relaxed text-body">
                            {post.content}
                          </p>

                          {/* Feedback callout if needs update */}
                          {post.status === 'needs_update' && post.feedback && (
                            <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/30 p-2.5 text-[11.5px] text-indigo-900 dark:text-indigo-200">
                              <p className="font-semibold flex items-center gap-1">
                                <AlertCircleIcon className="h-3 w-3" />
                                <span>Feedback given to user:</span>
                              </p>
                              <p className="mt-0.5 leading-relaxed">{post.feedback}</p>
                            </div>
                          )}

                          {/* Rejection callout */}
                          {post.status === 'rejected' && post.rejectionReason && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/30 p-2.5 text-[11.5px] text-rose-900 dark:text-rose-200">
                              <p className="font-semibold flex items-center gap-1">
                                <XCircleIcon className="h-3 w-3" />
                                <span>Rejection Reason:</span>
                              </p>
                              <p className="mt-0.5 leading-relaxed">{post.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </Td>

                      {/* Image Thumbnail */}
                      <Td className="align-top">
                        {post.imageUrl ? (
                          <button
                            type="button"
                            onClick={() => setZoomImageUrl(post.imageUrl || null)}
                            className="group relative block h-14 w-20 overflow-hidden rounded-xl border border-line bg-canvas"
                          >
                            <img
                              src={post.imageUrl}
                              alt="Attached"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white">
                              <EyeIcon className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-subtle italic">No image</span>
                        )}
                      </Td>

                      {/* Status */}
                      <Td className="whitespace-nowrap align-top">
                        <div className="space-y-1">
                          {renderStatusBadge(post.status)}
                          {post.reviewedBy && (
                            <p className="text-[10.5px] text-subtle">
                              By {post.reviewedBy}
                            </p>
                          )}
                        </div>
                      </Td>

                      {/* Moderation Actions */}
                      <Td align="right" className="align-top">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Inspect Details */}
                          <Tooltip label="View Full Details">
                            <button
                              onClick={() => setInspectPost(post)}
                              aria-label={`Inspect ${post.title}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>

                          {/* Approve Button */}
                          {post.status !== 'approved' && (
                            <Tooltip label="Approve & Publish">
                              <button
                                onClick={() => handleApprove(post)}
                                aria-label={`Approve ${post.title}`}
                                className="rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              >
                                <CheckCircle2Icon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          )}

                          {/* Send Feedback for Update Button */}
                          <Tooltip label="Send Feedback / Request Update">
                            <button
                              onClick={() => handleOpenFeedbackModal(post)}
                              aria-label={`Request edit for ${post.title}`}
                              className="rounded-md p-1.5 text-indigo-600 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                            >
                              <SendIcon className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>

                          {/* Reject Button */}
                          {post.status !== 'rejected' && (
                            <Tooltip label="Reject Post">
                              <button
                                onClick={() => handleOpenRejectModal(post)}
                                aria-label={`Reject ${post.title}`}
                                className="rounded-md p-1.5 text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              >
                                <XCircleIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          )}

                          {/* Delete Button */}
                          <Tooltip label="Delete Permanently">
                            <button
                              onClick={() => setDeletingPost(post)}
                              aria-label={`Delete ${post.title}`}
                              className="rounded-md p-1.5 text-subtle transition-colors hover:bg-danger-bg hover:text-danger"
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
              unit="posts"
            />
          </>
        )}
      </Card>

      {/* Send Feedback / Request Update Modal */}
      {feedbackPost && (
        <Modal
          open={Boolean(feedbackPost)}
          onClose={() => setFeedbackPost(null)}
          title="Send Feedback to Author"
          description={`Provide clear instructions to “${feedbackPost.author}” on what adjustments are needed before this post can be approved.`}
        >
          <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-2">
            <div className="rounded-xl border border-line bg-canvas p-3 text-xs">
              <p className="font-semibold text-ink">Post Title: “{feedbackPost.title}”</p>
              <p className="mt-1 text-body line-clamp-2">{feedbackPost.content}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Select a Feedback Preset
              </label>
              <div className="mt-1.5 space-y-1.5">
                {FEEDBACK_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFeedbackText(preset)}
                    className="block w-full text-left rounded-lg border border-line bg-surface p-2 text-xs text-body hover:border-primary hover:text-ink transition-colors"
                  >
                    “{preset}”
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Custom Feedback Message *
              </label>
              <Textarea
                rows={4}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write specific, supportive instructions for the author…"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
              <Button type="button" variant="ghost" onClick={() => setFeedbackPost(null)}>
                Cancel
              </Button>
              <Button type="submit">
                <SendIcon className="h-4 w-4" />
                Send Feedback & Set to Needs Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reject Post Modal */}
      {rejectingPost && (
        <Modal
          open={Boolean(rejectingPost)}
          onClose={() => setRejectingPost(null)}
          title="Reject Community Submission"
          description={`Select the primary reason for rejecting the post by “${rejectingPost.author}”.`}
        >
          <form onSubmit={handleSubmitReject} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Rejection Reason
              </label>
              <Select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1.5"
              >
                {REJECTION_REASONS.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </Select>
            </div>

            {rejectionReason === 'Other clinical safety concern' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                  Additional Details
                </label>
                <Textarea
                  rows={3}
                  required
                  value={customRejectionText}
                  onChange={(e) => setCustomRejectionText(e.target.value)}
                  placeholder="Explain why this post is unsuitable for publication…"
                  className="mt-1.5"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
              <Button type="button" variant="ghost" onClick={() => setRejectingPost(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="danger">
                Confirm Rejection
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Full Inspect Post Modal */}
      {inspectPost && (
        <Modal
          open={Boolean(inspectPost)}
          onClose={() => setInspectPost(null)}
          title={inspectPost.title}
          description={`By ${inspectPost.author} · Topic Tag: ${inspectPost.topicTag}`}
        >
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs text-subtle border-b border-line pb-3">
              <span>Submitted: {relativeTime(inspectPost.createdAt)}</span>
              <div>{renderStatusBadge(inspectPost.status)}</div>
            </div>

            <div className="text-sm leading-relaxed text-ink whitespace-pre-line bg-canvas p-4 rounded-2xl border border-line">
              {inspectPost.content}
            </div>

            {inspectPost.imageUrl && (
              <div className="overflow-hidden rounded-2xl border border-line bg-canvas">
                <img
                  src={inspectPost.imageUrl}
                  alt="Attached preview"
                  className="max-h-72 w-full object-cover"
                />
              </div>
            )}

            {inspectPost.feedback && (
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900/50 dark:bg-indigo-950/30 p-3 text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-semibold">Current Feedback Note:</p>
                <p className="mt-1">{inspectPost.feedback}</p>
              </div>
            )}

            {inspectPost.rejectionReason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/30 p-3 text-xs text-rose-900 dark:text-rose-200">
                <p className="font-semibold">Rejection Note:</p>
                <p className="mt-1">{inspectPost.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-line pt-4">
              <Button variant="ghost" onClick={() => setInspectPost(null)}>
                Close
              </Button>

              <div className="flex items-center gap-2">
                {inspectPost.status !== 'approved' && (
                  <Button
                    onClick={() => {
                      handleApprove(inspectPost);
                      setInspectPost(null);
                    }}
                  >
                    <CheckCircle2Icon className="h-4 w-4" />
                    Approve Post
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Image Zoom Modal */}
      {zoomImageUrl && (
        <Modal
          open={Boolean(zoomImageUrl)}
          onClose={() => setZoomImageUrl(null)}
          title="Attached Image Preview"
        >
          <div className="overflow-hidden rounded-2xl border border-line bg-canvas">
            <img
              src={zoomImageUrl}
              alt="Enlarged preview"
              className="max-h-[70vh] w-full object-contain"
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingPost)}
        onClose={() => setDeletingPost(null)}
        title="Delete this community post permanently?"
        description={
          deletingPost ? `“${deletingPost.title}” by ${deletingPost.author} will be deleted.` : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingPost(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deletingPost) return;
                deleteCommunityPost(deletingPost.id);
                toast.success(`Post by “${deletingPost.author}” deleted`);
                setDeletingPost(null);
              }}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          This post and all associated reactions will be permanently deleted from the database.
        </p>
      </Modal>
    </div>
  );
}
