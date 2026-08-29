import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  UsersIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  BanIcon,
  CheckCircle2Icon,
  EyeIcon,
  SearchIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  SendIcon,
  AlertTriangleIcon,
  LockIcon,
  UnlockIcon,
  Trash2Icon,
} from 'lucide-react';
import { useAdminStore } from '../contexts/AdminStore';
import type { AppUser, UserStatus } from '../types';
import { Card, SectionTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Label, Select } from '../components/ui/Field';
import { Pagination, SearchInput, TableShell, Td, Th } from '../components/ui/Table';
import { EmptyState, TableSkeleton } from '../components/ui/Skeleton';
import { Modal } from '../components/ui/Sheet';
import { Tooltip } from '../components/ui/Tooltip';
import { paginate, useSimulatedLoad, useTableState } from '../hooks/useTableState';
import { relativeTime } from '../utils/format';
import { cn } from '../utils/cn';

export function UserManagementPage() {
  const { users, toggleUserBlock, addUser, deleteUser, messages, reports } = useAdminStore();
  const loading = useSimulatedLoad(450);
  const table = useTableState(8);

  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');

  // Modal States
  const [blockingUser, setBlockingUser] = useState<AppUser | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'member' | 'verified_sender' | 'clinician' | 'caregiver'>('member');
  const [newUserNotes, setNewUserNotes] = useState('');

  // Calculations
  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;
  const totalMessagesSent = users.reduce((acc, u) => acc + (u.messagesSentCount || 0), 0);

  // Filtered users
  const filtered = useMemo(() => {
    const q = table.query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        q.length === 0 ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone.includes(q);

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [users, table.query, statusFilter]);


  const page = paginate(filtered, table.page, table.pageSize);

  const handleToggleBlockConfirm = () => {
    if (!blockingUser) return;
    const isCurrentlyBlocked = blockingUser.status === 'blocked';
    toggleUserBlock(blockingUser.id, blockReason.trim() || undefined);
    
    if (isCurrentlyBlocked) {
      toast.success(`User ${blockingUser.name} has been unblocked.`);
    } else {
      toast.warning(`User ${blockingUser.name} has been blocked from sending messages.`);
    }

    setBlockingUser(null);
    setBlockReason('');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error('Please enter name and email address.');
      return;
    }

    const created = addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+1 (555) 000-0000',
      role: newUserRole,
      notes: newUserNotes.trim() || undefined,
    });

    toast.success(`User “${created.name}” added successfully.`);
    setIsAddModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <SectionTitle
        title="User Management"
        description="Monitor registered sender accounts, track message dispatch activities, and manage access with instant Block and Unblock controls."
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <UserPlusIcon className="h-4 w-4" />
            Add User
          </Button>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Total Users</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-tint text-primary">
              <UsersIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{users.length}</p>
          <p className="mt-1 text-[11.5px] text-subtle">Registered in system</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Active Users</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheckIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {activeCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">In good standing</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Blocked Senders</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <BanIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-rose-600 dark:text-rose-400">
            {blockedCount}
          </p>
          <p className="mt-1 text-[11.5px] text-subtle">Access restricted</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Total Messages Sent</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <SendIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink">{totalMessagesSent}</p>
          <p className="mt-1 text-[11.5px] text-subtle">Across SMS & Email</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card>
        {/* Filters Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <SearchInput
            value={table.query}
            onChange={table.setQuery}
            placeholder="Search by name, email, or phone..."
            className="w-full sm:w-80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[140px]">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
                aria-label="Filter by status"
                className="h-9 text-[13px]"
              >
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="blocked">Blocked only</option>
              </Select>
            </div>

            <p className="ml-auto text-xs text-subtle">
              {filtered.length} of {users.length} users
            </p>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="h-4 w-4" />}
            title="No users match your criteria"
            description="Try changing the search query or status filter."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  table.setQuery('');
                  setStatusFilter('all');
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
                  <Th>User</Th>
                  <Th>Contact</Th>
                  <Th align="center">Messages Sent</Th>
                  <Th align="center">Reports</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th align="right">Actions / Access</Th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((user) => {
                  const isBlocked = user.status === 'blocked';
                  const userReportsCount = user.reportsReceivedCount || 0;

                  return (
                    <tr
                      key={user.id}
                      className={cn(
                        'transition-colors duration-150 ease-calm hover:bg-canvas/70',
                        isBlocked && 'bg-rose-500/[0.02]'
                      )}
                    >
                      {/* User Info */}
                      <Td>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-xs',
                              isBlocked
                                ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                : 'bg-primary-tint text-primary border border-primary/20'
                            )}
                          >
                            {user.initials || user.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="truncate text-[13.5px] font-medium text-ink">{user.name}</p>
                              {isBlocked ? (
                                <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                                  Blocked
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Td>

                      {/* Contact */}
                      <Td>
                        <div className="space-y-0.5 text-xs">
                          <div className="flex items-center gap-1.5 text-ink">
                            <MailIcon className="h-3 w-3 text-subtle" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-subtle">
                            <PhoneIcon className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        </div>
                      </Td>

                      {/* Messages Sent */}
                      <Td align="center">
                        <span className="inline-flex items-center gap-1 font-mono text-[13px] font-semibold text-ink">
                          <SendIcon className="h-3 w-3 text-subtle" />
                          {user.messagesSentCount}
                        </span>
                      </Td>

                      {/* Reports */}
                      <Td align="center">
                        {userReportsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 font-mono text-[11.5px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertTriangleIcon className="h-3 w-3" />
                            {userReportsCount}
                          </span>
                        ) : (
                          <span className="text-xs text-subtle">0</span>
                        )}
                      </Td>


                      {/* Status */}
                      <Td>
                        <Badge tone={isBlocked ? 'danger' : 'success'}>
                          {isBlocked ? 'Blocked' : 'Active'}
                        </Badge>
                      </Td>

                      {/* Joined Date */}
                      <Td className="whitespace-nowrap text-[12.5px] text-subtle">
                        {relativeTime(user.joinedAt)}
                      </Td>

                      {/* Actions & Block/Unblock button */}
                      <Td align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Primary Block/Unblock Action Button */}
                          <Button
                            variant={isBlocked ? 'secondary' : 'danger'}
                            size="sm"
                            onClick={() => {
                              setBlockingUser(user);
                              setBlockReason(user.blockedReason || '');
                            }}
                            className={cn(
                              'h-8 px-2.5 text-xs font-semibold shadow-2xs',
                              isBlocked
                                ? 'border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400'
                                : 'border-rose-500/30 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20'
                            )}
                          >
                            {isBlocked ? (
                              <>
                                <UnlockIcon className="h-3.5 w-3.5" />
                                <span>Unblock</span>
                              </>
                            ) : (
                              <>
                                <BanIcon className="h-3.5 w-3.5" />
                                <span>Block</span>
                              </>
                            )}
                          </Button>

                          {/* View Details */}
                          <Tooltip label="View User Profile & History">
                            <button
                              onClick={() => setViewingUser(user)}
                              aria-label={`View details for ${user.name}`}
                              className="rounded-md p-1.5 text-body transition-colors hover:bg-primary-tint hover:text-primary"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>

                          {/* Delete */}
                          <Tooltip label="Delete user account">
                            <button
                              onClick={() => setDeletingUser(user)}
                              aria-label={`Delete ${user.name}`}
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
              unit="users"
            />
          </>
        )}
      </Card>

      {/* Block / Unblock Confirmation Modal */}
      <Modal
        open={Boolean(blockingUser)}
        onClose={() => setBlockingUser(null)}
        title={blockingUser?.status === 'blocked' ? `Unblock ${blockingUser?.name}?` : `Block ${blockingUser?.name}?`}
        description={
          blockingUser?.status === 'blocked'
            ? 'This user will be restored to active standing and allowed to dispatch mental health resources.'
            : 'Blocking will immediately prevent this user from scheduling or sending any messages, and cancel any pending transmissions.'
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setBlockingUser(null)}>
              Cancel
            </Button>
            <Button
              variant={blockingUser?.status === 'blocked' ? 'primary' : 'danger'}
              onClick={handleToggleBlockConfirm}
            >
              {blockingUser?.status === 'blocked' ? 'Confirm Unblock' : 'Confirm Block User'}
            </Button>
          </>
        }
      >
        {blockingUser?.status !== 'blocked' ? (
          <div className="space-y-3 pt-2">
            <Label htmlFor="block-reason" hint="(Optional)">
              Reason for blocking
            </Label>
            <Input
              id="block-reason"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Unsolicited messaging, abusive language, multiple recipient complaints..."
            />
            <p className="text-[12px] text-subtle">
              This note will be recorded in the security audit log for admin review.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-canvas/60 p-3 text-xs text-body">
            <p className="font-semibold text-ink">Previous block note:</p>
            <p className="mt-1 italic">{blockingUser?.blockedReason || 'No reason specified.'}</p>
          </div>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        open={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        title={viewingUser ? viewingUser.name : 'User Details'}
        description={`ID: ${viewingUser?.id} · Joined ${viewingUser?.joinedAt ? new Date(viewingUser.joinedAt).toLocaleDateString() : ''}`}
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {viewingUser ? (
                <Button
                  variant={viewingUser.status === 'blocked' ? 'secondary' : 'danger'}
                  size="sm"
                  onClick={() => {
                    setBlockingUser(viewingUser);
                    setViewingUser(null);
                  }}
                >
                  {viewingUser.status === 'blocked' ? 'Unblock User' : 'Block User'}
                </Button>
              ) : null}
            </div>
            <Button variant="secondary" onClick={() => setViewingUser(null)}>
              Close
            </Button>
          </div>
        }
      >
        {viewingUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas/60 p-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-tint font-mono text-base font-bold text-primary">
                {viewingUser.initials}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-display text-base font-bold text-ink">{viewingUser.name}</p>
                  <Badge tone={viewingUser.status === 'blocked' ? 'danger' : 'success'}>
                    {viewingUser.status}
                  </Badge>
                </div>
                <p className="text-xs text-body">{viewingUser.email} · {viewingUser.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-line bg-surface p-3">
                <p className="text-subtle">Role</p>
                <p className="mt-1 font-semibold capitalize text-ink">{viewingUser.role.replace('_', ' ')}</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3">
                <p className="text-subtle">Messages Dispatched</p>
                <p className="mt-1 font-semibold text-ink">{viewingUser.messagesSentCount} messages</p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3">
                <p className="text-subtle">Reports Received</p>
                <p className={cn('mt-1 font-semibold', (viewingUser.reportsReceivedCount || 0) > 0 ? 'text-rose-600' : 'text-ink')}>
                  {viewingUser.reportsReceivedCount || 0} incidents
                </p>
              </div>
              <div className="rounded-lg border border-line bg-surface p-3">
                <p className="text-subtle">Last Active</p>
                <p className="mt-1 font-semibold text-ink">{relativeTime(viewingUser.lastActiveAt)}</p>
              </div>
            </div>

            {viewingUser.notes ? (
              <div className="rounded-lg border border-line bg-surface p-3 text-xs">
                <p className="font-semibold text-ink">Administrative Notes</p>
                <p className="mt-1 text-body leading-relaxed">{viewingUser.notes}</p>
              </div>
            ) : null}

            {viewingUser.status === 'blocked' && viewingUser.blockedReason ? (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-800 dark:text-rose-300">
                <p className="font-semibold">Blocking Details</p>
                <p className="mt-1">{viewingUser.blockedReason}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {/* Add User Modal */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        description="Create a verified user or caregiver profile with transmission authorization."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>Create User Profile</Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5">
          <div>
            <Label htmlFor="usr-name">Full Name *</Label>
            <Input
              id="usr-name"
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="e.g. Jordan Miller"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="usr-email">Email Address *</Label>
              <Input
                id="usr-email"
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label htmlFor="usr-phone">Phone Number</Label>
              <Input
                id="usr-phone"
                value={newUserPhone}
                onChange={(e) => setNewUserPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="usr-role">User Role</Label>
            <Select
              id="usr-role"
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as any)}
            >
              <option value="member">Standard Member</option>
              <option value="verified_sender">Verified Sender</option>
              <option value="caregiver">Caregiver</option>
              <option value="clinician">Licensed Clinician</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="usr-notes" hint="(Optional)">Admin Notes</Label>
            <Input
              id="usr-notes"
              value={newUserNotes}
              onChange={(e) => setNewUserNotes(e.target.value)}
              placeholder="Verification info or caregiver notes..."
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        title="Delete user account?"
        description={
          deletingUser
            ? `User “${deletingUser.name}” (${deletingUser.email}) will be permanently removed.`
            : ''
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!deletingUser) return;
                deleteUser(deletingUser.id);
                toast.success(`User ${deletingUser.name} deleted.`);
                setDeletingUser(null);
              }}
            >
              Delete User
            </Button>
          </>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-body">
          This will permanently purge this account profile. Historical zero-retention logs will remain anonymized.
        </p>
      </Modal>
    </div>
  );
}
