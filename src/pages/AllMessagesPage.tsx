import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  MessageSquareIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  EyeIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ShieldCheckIcon,
  AlertCircleIcon,
  LayersIcon,
  SparklesIcon,
  Trash2Icon,
  ChevronRightIcon,
  CheckCheckIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { AdminMessage, Channel, MessageApprovalStatus } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge, ToneBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Label, Select, Textarea } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

export function AllMessagesPage() {
  const { messages, approveMessage, rejectMessage, approveAllPendingMessages, deleteMessage, users } =
    useAdminStore();
  const loading = useSimulatedLoad(450);
  const table = useTableState(8);

  const [statusFilter, setStatusFilter] = useState<MessageApprovalStatus | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');

  // Modals
  const [rejectingMsg, setRejectingMsg] = useState<AdminMessage | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Violates platform communication guidelines.');
  const [customRejectionNote, setCustomRejectionNote] = useState('');
  const [viewingMsg, setViewingMsg] = useState<AdminMessage | null>(null);
  const [deletingMsg, setDeletingMsg] = useState<AdminMessage | null>(null);

  // Statistics
  const pendingCount = messages.filter((m) => m.status === 'pending').length;
  const approvedCount = messages.filter((m) => m.status === 'approved').length;
  const deliveredCount = messages.filter((m) => m.status === 'delivered').length;
  const rejectedCount = messages.filter((m) => m.status === 'rejected').length;

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return messages.filter((msg) => {
      const matchesQuery =
        q.length === 0 ||
        msg.senderName.toLowerCase().includes(q) ||
        msg.senderEmail.toLowerCase().includes(q) ||
        msg.recipientContact.toLowerCase().includes(q) ||
        (msg.recipientName && msg.recipientName.toLowerCase().includes(q)) ||
        msg.topicTitle.toLowerCase().includes(q) ||
        msg.customNote.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
      const matchesChannel = channelFilter === 'all' || msg.channel === channelFilter;

      return matchesQuery && matchesStatus && matchesChannel;
    });
  }, [messages, table.query, statusFilter, channelFilter]);

  const page = paginate(filtered, table.page, table.pageSize);

  const handleApprove = (msg: AdminMessage) => {
    approveMessage(msg.id);
    toast.success(`Message from ${msg.senderName} to ${msg.recipientContact} approved.`);
  };

  const handleApproveAll = () => {
    const count = approveAllPendingMessages();
    if (count > 0) {
      toast.success(`Batch approved ${count} pending message${count === 1 ? '' : 's'}.`);
    } else {
      toast.info('No pending messages to approve.');
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectingMsg) return;
    const finalReason = customRejectionNote.trim()
      ? `${rejectionReason} (${customRejectionNote.trim()})`
      : rejectionReason;

    rejectMessage(rejectingMsg.id, finalReason);
    toast.error(`Message from ${rejectingMsg.senderName} rejected.`);
    setRejectingMsg(null);
    setCustomRejectionNote('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <SectionTitle
        title="All Messages & Moderation Queue"
        description="Review all messages submitted by users before transmission. Admin approval ensures compassionate, safe, and confidential zero-retention delivery."
        action={
          pendingCount > 0 ? (
            <Button onClick={handleApproveAll} className="gap-1.5">
              <CheckCheckIcon className="h-4 w-4" />
              Approve All Pending ({pendingCount})
            </Button>
          ) : undefined
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Pending Review</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ClockIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Requires moderator review</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Approved / Ready</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {approvedCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Queued for dispatch</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Delivered</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <SendIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{deliveredCount}</p>
          <p className="mt-1 text-[11.5px] text-subtle">Successfully transmitted</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Rejected Messages</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <XCircleIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
            {rejectedCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Failed safety screening</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search sender, recipient, topic, or message note..."
            className="w-full sm:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[160px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as MessageApprovalStatus | 'all')}
                aria-label="Filter by approval status"
                className="h-9 text-[13px]"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="delivered">Delivered</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>

            <div className="w-[140px]">
              <Select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as Channel | 'all')}
                aria-label="Filter by channel"
                className="h-9 text-[13px]"
              >
                <option value="all">All channels</option>
                <option value="sms">SMS text</option>
                <option value="email">Email dispatch</option>
              </Select>
            </div>

            <p className="ml-auto text-xs text-subtle">
              {filtered.length} of {messages.length} messages
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={7} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<MessageSquareIcon className="h-4 w-4" />}
            title="No messages match your filters"
            description="Try adjusting your search criteria or resetting filters."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setStatusFilter('all');
                  setChannelFilter('all');
                }}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Sender</Th>
                  <Th>Recipient & Channel</Th>
                  <Th>Topic Resource</Th>
                  <Th>Message Note Preview</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                  <Th align="right">Moderation Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((msg) => {
                  const senderUser = users.find((u) => u.id === msg.senderId);
                  const isSenderBlocked = senderUser?.status === 'blocked';

                  return (
                    <tr
                      key={msg.id}
                      className={cn(
                        'transition-colors duration-150 ease-calm hover:bg-canvas/70',
                        msg.status === 'pending' && 'bg-amber-500/[0.03]'
                      )}
                    >
                      {/* Sender */}
                      <Td>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-ink text-[13.5px]">{msg.senderName}</span>
                            {isSenderBlocked ? (
                              <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-rose-600">
                                Blocked User
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[11px] text-subtle">{msg.senderEmail}</p>
                        </div>
                      </Td>

                      {/* Recipient & Channel */}
                      <Td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider',
                                msg.channel === 'sms'
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              )}
                            >
                              {msg.channel === 'sms' ? (
                                <>
                                  <PhoneIcon className="h-2.5 w-2.5" /> SMS
                                </>
                              ) : (
                                <>
                                  <MailIcon className="h-2.5 w-2.5" /> Email
                                </>
                              )}
                            </span>
                            <span className="font-medium text-xs text-ink">{msg.recipientContact}</span>
                          </div>
                          {msg.recipientName ? (
                            <p className="text-[11px] text-subtle">
                              For: {msg.recipientName} {msg.recipientRelationship ? `(${msg.recipientRelationship})` : ''}
                            </p>
                          ) : null}
                        </div>
                      </Td>

                      {/* Attached Topic & Tone */}
                      <Td>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-ink line-clamp-1">{msg.topicTitle}</p>
                          <ToneBadge tone={msg.tone} />
                        </div>
                      </Td>

                      {/* Custom Note Snippet */}
                      <Td className="max-w-[260px]">
                        <button
                          type="button"
                          onClick={() => setViewingMsg(msg)}
                          className="text-left group"
                        >
                          <p className="text-xs text-body line-clamp-2 leading-relaxed group-hover:text-ink transition-colors">
                            “{msg.customNote}”
                          </p>
                          <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10.5px] text-primary font-medium group-hover:underline">
                            View full note <ChevronRightIcon className="h-3 w-3" />
                          </span>
                        </button>
                      </Td>

                      {/* Approval Status Badge */}
                      <Td>
                        {msg.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-amber-700 dark:text-amber-400">
                            <ClockIcon className="h-3 w-3 animate-spin" /> Pending Review
                          </span>
                        ) : msg.status === 'approved' ? (
                          <Badge tone="success">Approved</Badge>
                        ) : msg.status === 'delivered' ? (
                          <Badge tone="primary">Delivered</Badge>
                        ) : (
                          <Badge tone="danger">Rejected</Badge>
                        )}
                      </Td>

                      {/* Timestamp */}
                      <Td className="whitespace-nowrap text-[12px] text-subtle">
                        {relativeTime(msg.submittedAt)}
                      </Td>

                      {/* Actions */}
                      <Td align="right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Approve Button */}
                          {msg.status !== 'approved' && msg.status !== 'delivered' ? (
                            <Tooltip label="Approve message for dispatch">
                              <button
                                onClick={() => handleApprove(msg)}
                                aria-label="Approve message"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          ) : null}

                          {/* Quick Reject Button */}
                          {msg.status !== 'rejected' ? (
                            <Tooltip label="Reject message">
                              <button
                                onClick={() => setRejectingMsg(msg)}
                                aria-label="Reject message"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-50 text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                              >
                                <XIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          ) : null}

                          {/* View details */}
                          <Tooltip label="Inspect Message & Recipient Preview">
                            <button
                              onClick={() => setViewingMsg(msg)}
                              aria-label="View message details"
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>

                          {/* Delete */}
                          <Tooltip label="Delete message record">
                            <button
                              onClick={() => setDeletingMsg(msg)}
                              aria-label="Delete message"
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
              unit="messages"
            />
          </>
        )}
      </Card>

      {/* Reject Message Modal */}
      <Modal
        open={Boolean(rejectingMsg)}
        onClose={() => setRejectingMsg(null)}
        title="Reject Message Transmission"
        description={
          rejectingMsg
            ? `Message from ${rejectingMsg.senderName} to ${rejectingMsg.recipientContact} will not be dispatched.`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectingMsg(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-4 pt-1">
          <div>
            <Label htmlFor="rej-category">Rejection Reason</Label>
            <Select
              id="rej-category"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            >
              <option value="Violates platform communication guidelines.">
                Violates platform communication guidelines
              </option>
              <option value="Commercial advertising / promotional links detected.">
                Commercial advertising / promotional links detected
              </option>
              <option value="Harassing, hostile, or coercive tone in message text.">
                Harassing, hostile, or coercive tone in message text
              </option>
              <option value="Sensitive medical diagnosis claims without authorization.">
                Sensitive medical claims without authorization
              </option>
              <option value="Suspicious or unverified recipient contact.">
                Suspicious or unverified recipient contact
              </option>
              <option value="Other administrative safety reason.">
                Other administrative safety reason
              </option>
            </Select>
          </div>

          <div>
            <Label htmlFor="rej-notes" hint="(Optional)">Additional Moderator Notes</Label>
            <Textarea
              id="rej-notes"
              rows={3}
              value={customRejectionNote}
              onChange={(e) => setCustomRejectionNote(e.target.value)}
              placeholder="Add specific context for the audit log..."
            />
          </div>
        </div>
      </Modal>

      {/* Full Message Details & Recipient Preview Modal */}
      <Modal
        open={Boolean(viewingMsg)}
        onClose={() => setViewingMsg(null)}
        title="Message Review & Recipient Preview"
        description={`ID: ${viewingMsg?.id} · Submitted ${viewingMsg?.submittedAt ? new Date(viewingMsg.submittedAt).toLocaleString() : ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {viewingMsg && viewingMsg.status !== 'approved' && viewingMsg.status !== 'delivered' ? (
                <Button
                  size="sm"
                  onClick={() => {
                    handleApprove(viewingMsg);
                    setViewingMsg(null);
                  }}
                >
                  <CheckIcon className="h-3.5 w-3.5" /> Approve Message
                </Button>
              ) : null}

              {viewingMsg && viewingMsg.status !== 'rejected' ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const toReject = viewingMsg;
                    setViewingMsg(null);
                    setRejectingMsg(toReject);
                  }}
                >
                  <XIcon className="h-3.5 w-3.5" /> Reject Message
                </Button>
              ) : null}
            </div>

            <Button variant="secondary" onClick={() => setViewingMsg(null)}>
              Close
            </Button>
          </div>
        }
      >
        {viewingMsg ? (
          <div className="space-y-4">
            {/* Sender & Recipient Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-line bg-canvas/60 p-3">
                <p className="font-semibold text-subtle uppercase text-[10px] tracking-wider">Sender Info</p>
                <p className="mt-1 font-bold text-ink">{viewingMsg.senderName}</p>
                <p className="text-body">{viewingMsg.senderEmail}</p>
                {viewingMsg.senderPhone ? <p className="text-subtle">{viewingMsg.senderPhone}</p> : null}
              </div>

              <div className="rounded-xl border border-line bg-canvas/60 p-3">
                <p className="font-semibold text-subtle uppercase text-[10px] tracking-wider">Target Recipient</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="font-bold text-ink">{viewingMsg.recipientContact}</span>
                  <span className="rounded bg-primary-tint px-1.5 py-0.2 text-[10px] font-bold text-primary uppercase">
                    {viewingMsg.channel}
                  </span>
                </div>
                {viewingMsg.recipientName ? (
                  <p className="text-body">
                    {viewingMsg.recipientName} {viewingMsg.recipientRelationship ? `(${viewingMsg.recipientRelationship})` : ''}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Attached Resource Info */}
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
                  <LayersIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-ink">{viewingMsg.topicTitle}</p>
                  <p className="text-subtle font-mono text-[11px]">/resource/{viewingMsg.topicId}</p>
                </div>
              </div>
              <ToneBadge tone={viewingMsg.tone} />
            </div>

            {/* Simulated Recipient Device Preview */}
            <div className="rounded-2xl border border-line bg-canvas/80 p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-subtle">
                  Recipient Message Preview ({viewingMsg.channel.toUpperCase()})
                </span>
                <span className="text-[10.5px] text-emerald-600 font-medium">Zero-Retention Buffer</span>
              </div>

              <div className="rounded-xl bg-surface border border-line p-3.5 text-xs space-y-2 shadow-xs">
                <p className="font-medium text-ink leading-relaxed whitespace-pre-wrap">
                  {viewingMsg.customNote}
                </p>

                <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[11px] text-primary">
                  <span className="underline">Confidential Mental Health Guide Link</span>
                  <span className="text-subtle">mhanonymous.org</span>
                </div>
              </div>
            </div>

            {/* Rejection / Approval Status Log */}
            {viewingMsg.status === 'rejected' && viewingMsg.rejectionReason ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertCircleIcon className="h-3.5 w-3.5" /> Rejection Note
                </p>
                <p className="mt-1">{viewingMsg.rejectionReason}</p>
              </div>
            ) : null}

            {viewingMsg.status === 'approved' ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2Icon className="h-3.5 w-3.5" /> Approved by {viewingMsg.approvedBy || 'Admin Console'}
                </p>
                {viewingMsg.approvedAt ? (
                  <p className="mt-0.5 text-[11px] opacity-80">
                    Timestamp: {new Date(viewingMsg.approvedAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingMsg)}
        onClose={() => setDeletingMsg(null)}
        title="Delete message record?"
        description={
          deletingMsg
            ? `Message from ${deletingMsg.senderName} (${deletingMsg.id}) will be removed from the moderation queue.`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingMsg(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deletingMsg) return;
                deleteMessage(deletingMsg.id);
                toast.success('Message record deleted.');
                setDeletingMsg(null);
              }}
            >
              Delete Record
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          This removes the message from the dispatch queue permanently.
        </p>
      </Modal>
    </div>
  );
}
