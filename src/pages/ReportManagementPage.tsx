import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  ShieldAlertIcon,
  AlertTriangleIcon,
  BanIcon,
  CheckCircle2Icon,
  EyeIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  CheckCheckIcon,
  LayersIcon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { Channel, MessageReport, ReportReasonCategory, ReportStatus } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Label, Select, Textarea } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

const REASON_LABELS: Record<ReportReasonCategory, { label: string; tone: 'danger' | 'warning' | 'neutral' | 'primary' }> = {
  harassment: { label: 'Harassment / Abuse', tone: 'danger' },
  spam: { label: 'Commercial Spam', tone: 'warning' },
  unsolicited: { label: 'Unsolicited Contact', tone: 'warning' },
  distressing: { label: 'Distressing Content', tone: 'danger' },
  wrong_number: { label: 'Wrong Number / Typo', tone: 'neutral' },
  other: { label: 'Other Concern', tone: 'primary' },
};

export function ReportManagementPage() {
  const { reports, users, resolveReport, blockReportedUser } = useAdminStore();
  const loading = useSimulatedLoad(450);
  const table = useTableState(8);

  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [reasonFilter, setReasonFilter] = useState<ReportReasonCategory | 'all'>('all');
  const [channelFilter, setChannelFilter] = useState<Channel | 'all'>('all');

  // Modals
  const [viewingReport, setViewingReport] = useState<MessageReport | null>(null);
  const [blockingReport, setBlockingReport] = useState<MessageReport | null>(null);
  const [blockExplanation, setBlockExplanation] = useState('');
  const [resolvingReport, setResolvingReport] = useState<MessageReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Stats
  const totalReports = reports.length;
  const newReportsCount = reports.filter((r) => r.status === 'new').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;
  const blockedUsersCount = users.filter((u) => u.status === 'blocked').length;

  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return reports.filter((rep) => {
      const matchesQuery =
        q.length === 0 ||
        rep.reportedPersonName.toLowerCase().includes(q) ||
        rep.reportedPersonContact.toLowerCase().includes(q) ||
        rep.reasonText.toLowerCase().includes(q) ||
        rep.topicTitle.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'all' || rep.status === statusFilter;
      const matchesReason = reasonFilter === 'all' || rep.reasonCategory === reasonFilter;
      const matchesChannel = channelFilter === 'all' || rep.reportedByChannel === channelFilter;

      return matchesQuery && matchesStatus && matchesReason && matchesChannel;
    });
  }, [reports, table.query, statusFilter, reasonFilter, channelFilter]);

  const page = paginate(filtered, table.page, table.pageSize);

  const handleBlockReportedUser = () => {
    if (!blockingReport) return;
    blockReportedUser(blockingReport.id, blockExplanation.trim() || undefined);
    toast.warning(`Reported user “${blockingReport.reportedPersonName}” has been blocked and report marked as Resolved.`);
    setBlockingReport(null);
    setBlockExplanation('');
    if (viewingReport?.id === blockingReport.id) {
      setViewingReport(null);
    }
  };

  const handleResolveConfirm = () => {
    if (!resolvingReport) return;
    resolveReport(resolvingReport.id, resolutionNotes.trim() || undefined);
    toast.success(`Report #${resolvingReport.id} marked as Resolved.`);
    setResolvingReport(null);
    setResolutionNotes('');
    if (viewingReport?.id === resolvingReport.id) {
      setViewingReport(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <SectionTitle
        title="Incident & Message Reports"
        description="Review reports submitted by message recipients. Displays reported person, timestamp, reported reason, and allows instant user blocking."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Total Reports</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <ShieldAlertIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{totalReports}</p>
          <p className="mt-1 text-[11.5px] text-subtle">Submitted by receivers</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">New Reports</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangleIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
            {newReportsCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Awaiting administrator action</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Resolved</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {resolvedCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Action taken & resolved</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Blocked Senders</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <BanIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{blockedUsersCount}</p>
          <p className="mt-1 text-[11.5px] text-subtle">Access restricted</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        {/* Table Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search reported person, reason, or topic..."
            className="w-full sm:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[150px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
                aria-label="Filter by report status"
                className="h-9 text-[13px]"
              >
                <option value="all">All statuses</option>
                <option value="new">New Report</option>
                <option value="resolved">Resolved</option>
              </Select>
            </div>

            <div className="w-[170px]">
              <Select
                value={reasonFilter}
                onChange={(e) => setReasonFilter(e.target.value as ReportReasonCategory | 'all')}
                aria-label="Filter by reason"
                className="h-9 text-[13px]"
              >
                <option value="all">All reason types</option>
                <option value="harassment">Harassment / Abuse</option>
                <option value="spam">Commercial Spam</option>
                <option value="unsolicited">Unsolicited Contact</option>
                <option value="distressing">Distressing Content</option>
                <option value="wrong_number">Wrong Number / Typo</option>
                <option value="other">Other Concern</option>
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
                <option value="sms">SMS link</option>
                <option value="email">Email link</option>
              </Select>
            </div>

            <p className="ml-auto text-xs text-subtle">
              {filtered.length} of {reports.length} reports
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<ShieldAlertIcon className="h-4 w-4" />}
            title="No reports match your filters"
            description="Try changing the search query or resetting filters."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setStatusFilter('all');
                  setReasonFilter('all');
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
                  <Th>Reported Person (Sender)</Th>
                  <Th>Reported Time</Th>
                  <Th>Reason & Details</Th>
                  <Th>Status</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((rep) => {
                  const matchUser = users.find(
                    (u) =>
                      u.id === rep.reportedPersonId ||
                      u.email.toLowerCase() === rep.reportedPersonContact.toLowerCase() ||
                      u.name.toLowerCase() === rep.reportedPersonName.toLowerCase()
                  );
                  const isSenderBlocked = matchUser?.status === 'blocked';
                  const reasonMeta = REASON_LABELS[rep.reasonCategory] || REASON_LABELS.other;

                  return (
                    <tr
                      key={rep.id}
                      className={cn(
                        'transition-colors duration-150 ease-calm hover:bg-canvas/70',
                        rep.status === 'new' && 'bg-rose-500/[0.03]'
                      )}
                    >
                      {/* Reported Person */}
                      <Td>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-ink text-[13.5px]">
                              {rep.reportedPersonName}
                            </span>
                            {isSenderBlocked ? (
                              <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-rose-600">
                                Blocked
                              </span>
                            ) : (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-emerald-600">
                                Active Sender
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-subtle">{rep.reportedPersonContact}</p>
                          <p className="text-[10.5px] font-mono text-subtle">Topic: {rep.topicTitle}</p>
                        </div>
                      </Td>

                      {/* Reported Time */}
                      <Td className="whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs font-medium text-ink">
                            <ClockIcon className="h-3 w-3 text-subtle" />
                            <span>{relativeTime(rep.reportedAt)}</span>
                          </div>
                          <p className="text-[11px] text-subtle">
                            {new Date(rep.reportedAt).toLocaleDateString()} {new Date(rep.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </Td>

                      {/* Reason & Category */}
                      <Td className="max-w-[340px]">
                        <div className="space-y-1">
                          <Badge tone={reasonMeta.tone}>{reasonMeta.label}</Badge>
                          <button
                            type="button"
                            onClick={() => setViewingReport(rep)}
                            className="text-left group block"
                          >
                            <p className="text-xs text-body line-clamp-2 leading-relaxed group-hover:text-ink transition-colors">
                              “{rep.reasonText}”
                            </p>
                          </button>
                        </div>
                      </Td>

                      {/* Status: New Report or Resolved */}
                      <Td>
                        {rep.status === 'new' ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[11.5px] font-bold text-rose-700 dark:text-rose-400">
                            <AlertTriangleIcon className="h-3 w-3" /> New Report
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2Icon className="h-3 w-3" /> Resolved
                          </span>
                        )}
                      </Td>

                      {/* Actions */}
                      <Td align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* One-click Block Reported User button */}
                          {!isSenderBlocked ? (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setBlockingReport(rep);
                                setBlockExplanation(`Blocked following incident report: ${rep.reasonText}`);
                              }}
                              className="h-8 px-2.5 text-xs font-semibold"
                            >
                              <BanIcon className="h-3.5 w-3.5" />
                              <span>Block User</span>
                            </Button>
                          ) : (
                            <span className="rounded border border-line bg-canvas px-2 py-1 text-[11px] font-medium text-subtle">
                              User Blocked
                            </span>
                          )}

                          {/* Quick Resolve Button */}
                          {rep.status !== 'resolved' ? (
                            <Tooltip label="Mark report as Resolved">
                              <button
                                onClick={() => {
                                  setResolvingReport(rep);
                                  setResolutionNotes('');
                                }}
                                aria-label="Resolve report"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                              >
                                <CheckCheckIcon className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          ) : null}

                          {/* View details modal */}
                          <Tooltip label="View Full Report Summary">
                            <button
                              onClick={() => setViewingReport(rep)}
                              aria-label="View report details"
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
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
              unit="reports"
            />
          </>
        )}
      </Card>

      {/* Block Reported Person Confirmation Modal */}
      <Modal
        open={Boolean(blockingReport)}
        onClose={() => setBlockingReport(null)}
        title={blockingReport ? `Block ${blockingReport.reportedPersonName}?` : 'Block Reported User'}
        description="This will block the reported person from dispatching future messages and automatically mark this report as Resolved."
        footer={
          <>
            <Button variant="ghost" onClick={() => setBlockingReport(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleBlockReportedUser}>
              Confirm Block User
            </Button>
          </>
        }
      >
        {blockingReport ? (
          <div className="space-y-3 pt-1">
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-900 dark:text-rose-300">
              <p className="font-semibold">Incident Complaint:</p>
              <p className="mt-1 leading-relaxed italic">“{blockingReport.reasonText}”</p>
            </div>

            <div>
              <Label htmlFor="block-note">Administrative Reason / Log</Label>
              <Textarea
                id="block-note"
                rows={2}
                value={blockExplanation}
                onChange={(e) => setBlockExplanation(e.target.value)}
                placeholder="Reason for blocking..."
              />
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Resolve Report Modal */}
      <Modal
        open={Boolean(resolvingReport)}
        onClose={() => setResolvingReport(null)}
        title="Resolve Incident Report"
        description={`Report #${resolvingReport?.id} filed for ${resolvingReport?.reportedPersonName}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setResolvingReport(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolveConfirm}>
              Mark as Resolved
            </Button>
          </>
        }
      >
        <div className="space-y-3 pt-1">
          <div>
            <Label htmlFor="res-notes" hint="(Optional)">Resolution Summary Notes</Label>
            <Textarea
              id="res-notes"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Spoke with sender, recipient number removed from buffer, warning issued..."
            />
          </div>
        </div>
      </Modal>

      {/* Full Report Details Modal */}
      <Modal
        open={Boolean(viewingReport)}
        onClose={() => setViewingReport(null)}
        title={`Report #${viewingReport?.id}`}
        description={`Submitted ${viewingReport?.reportedAt ? new Date(viewingReport.reportedAt).toLocaleString() : ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {viewingReport ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const toBlock = viewingReport;
                    setViewingReport(null);
                    setBlockingReport(toBlock);
                    setBlockExplanation(`Blocked following incident report: ${toBlock.reasonText}`);
                  }}
                >
                  <BanIcon className="h-3.5 w-3.5" /> Block Reported Person
                </Button>
              ) : null}

              {viewingReport && viewingReport.status !== 'resolved' ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const toRes = viewingReport;
                    setViewingReport(null);
                    setResolvingReport(toRes);
                  }}
                >
                  <CheckCheckIcon className="h-3.5 w-3.5" /> Resolve Report
                </Button>
              ) : null}
            </div>

            <Button variant="secondary" onClick={() => setViewingReport(null)}>
              Close
            </Button>
          </div>
        }
      >
        {viewingReport ? (
          <div className="space-y-4 text-xs">
            {/* Reported Person Card */}
            <div className="rounded-xl border border-line bg-canvas/60 p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-subtle uppercase text-[10px] tracking-wider">Reported Person (Sender)</p>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                  viewingReport.status === 'new' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
                )}>
                  {viewingReport.status === 'new' ? 'New Report' : 'Resolved'}
                </span>
              </div>
              <p className="mt-1 font-bold text-ink text-sm">{viewingReport.reportedPersonName}</p>
              <p className="text-body">{viewingReport.reportedPersonContact}</p>
              <p className="mt-1 text-subtle">Attached Topic: {viewingReport.topicTitle}</p>
            </div>

            {/* Reason Box */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[11px] tracking-wider">
                  Reported Reason ({REASON_LABELS[viewingReport.reasonCategory]?.label || viewingReport.reasonCategory})
                </span>
                <span className="text-subtle font-mono text-[10.5px]">{relativeTime(viewingReport.reportedAt)}</span>
              </div>
              <p className="text-ink leading-relaxed whitespace-pre-wrap font-medium">
                “{viewingReport.reasonText}”
              </p>
            </div>

            {/* Resolution Details */}
            {viewingReport.resolutionNotes ? (
              <div className="rounded-xl border border-line bg-surface p-3.5 space-y-1">
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-600" /> Resolution Log
                </p>
                <p className="text-body leading-relaxed">{viewingReport.resolutionNotes}</p>
                {viewingReport.resolvedAt ? (
                  <p className="text-[10.5px] text-subtle pt-1">
                    Resolved on {new Date(viewingReport.resolvedAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

