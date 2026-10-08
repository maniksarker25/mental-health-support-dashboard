import React, { useState, useMemo } from 'react';
import {
  ShoppingBagIcon,
  SearchIcon,
  XIcon,
  MailIcon,
  SparklesIcon,
  CheckCircle2Icon,
  ClockIcon,
  SendIcon,
  ExternalLinkIcon,
  CreditCardIcon,
  CrownIcon,
  AlertCircleIcon,
  UserIcon,
  DollarSignIcon,
  EyeIcon,
  CheckIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '../contexts/AdminStore';
import { SectionTitle } from '../components/ui/Card';
import { cn } from '../utils/cn';
import type { IPackagePurchase, PackageTierKey } from '../types';

export function PackagePurchasesPage() {
  const { packagePurchases, sendConsultationEmail, refundPackagePurchase } = useAdminStore();

  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [consultationFilter, setConsultationFilter] = useState<'all' | 'pending' | 'sent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Send Consultation Email Modal
  const [activeConsultationModal, setActiveConsultationModal] = useState<IPackagePurchase | null>(null);
  const [consultationLinkInput, setConsultationLinkInput] = useState('');
  const [consultationSubject, setConsultationSubject] = useState(
    'Your 1-on-1 Consultation Session with Dr. Skelton (Mention Support)'
  );
  const [consultationMessage, setConsultationMessage] = useState(
    `Dear Customer,\n\nThank you for choosing the Premium Support Package. As part of your package, your private 1-on-1 consultation session with Dr. Skelton is now ready to be scheduled.\n\nPlease use the secure link below to select your preferred date and time or join your private video room directly.\n\nWarm regards,\nDr. Skelton & Clinical Care Team`
  );
  const [isSending, setIsSending] = useState(false);

  // View Details Modal
  const [activeDetailsModal, setActiveDetailsModal] = useState<IPackagePurchase | null>(null);

  // Calculate KPIs
  const totalRevenue = useMemo(() => {
    return packagePurchases.reduce((acc, curr) => (curr.status === 'completed' ? acc + curr.amount : acc), 0);
  }, [packagePurchases]);

  const basicCount = useMemo(() => {
    return packagePurchases.filter((p) => p.packageTier === 'basic').length;
  }, [packagePurchases]);

  const standardCount = useMemo(() => {
    return packagePurchases.filter((p) => p.packageTier === 'standard').length;
  }, [packagePurchases]);

  const premiumCount = useMemo(() => {
    return packagePurchases.filter((p) => p.packageTier === 'premium').length;
  }, [packagePurchases]);

  const pendingConsultationsCount = useMemo(() => {
    return packagePurchases.filter((p) => p.packageTier === 'premium' && !p.consultationSent).length;
  }, [packagePurchases]);

  // Filtered Purchases
  const filteredPurchases = useMemo(() => {
    return packagePurchases.filter((purchase) => {
      // Tier filter
      if (selectedTier !== 'all' && purchase.packageTier !== selectedTier) {
        return false;
      }

      // Consultation filter (for premium)
      if (selectedTier === 'premium' || selectedTier === 'all') {
        if (consultationFilter === 'pending' && (!purchase.packageTier.includes('premium') || purchase.consultationSent)) {
          return false;
        }
        if (consultationFilter === 'sent' && (!purchase.packageTier.includes('premium') || !purchase.consultationSent)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = purchase.customerName.toLowerCase().includes(q);
        const matchesEmail = purchase.customerEmail.toLowerCase().includes(q);
        const matchesTxn = purchase.transactionId.toLowerCase().includes(q);
        const matchesTopic = purchase.topicName?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesEmail && !matchesTxn && !matchesTopic) {
          return false;
        }
      }

      return true;
    });
  }, [packagePurchases, selectedTier, consultationFilter, searchQuery]);

  const handleOpenConsultationModal = (purchase: IPackagePurchase) => {
    setActiveConsultationModal(purchase);
    // Pre-fill a realistic consultation room / scheduling link if not already existing
    setConsultationLinkInput(
      purchase.consultationLink ||
        `https://meet.google.com/drs-skelton-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}`
    );
    setConsultationSubject(`Your 1-on-1 Consultation Session with Dr. Skelton (Mention Support)`);
    setConsultationMessage(
      `Dear ${purchase.customerName},\n\nThank you for choosing the Premium Package. As part of your package, your private 1-on-1 consultation session with Dr. Skelton is now ready.\n\nPlease use the secure link below to join your session or select your preferred time slot:\n\nIf you have any questions or specific areas of concern beforehand, feel free to reply directly to this email.\n\nWarm regards,\nDr. Skelton, PsyD\nClinical Lead`
    );
  };

  const handleSendConsultationEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsultationModal) return;

    if (!consultationLinkInput.trim()) {
      toast.error('Please enter a valid consultation link.');
      return;
    }

    setIsSending(true);

    setTimeout(() => {
      sendConsultationEmail(
        activeConsultationModal.id,
        consultationLinkInput.trim(),
        consultationMessage.trim()
      );
      setIsSending(false);
      setActiveConsultationModal(null);
      toast.success(
        `Consultation email with Dr. Skelton's link sent successfully to ${activeConsultationModal.customerEmail}!`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SectionTitle
          title="Package Purchases & Revenue"
          description="Track customer orders for Basic ($49), Standard ($79), and Premium ($149) one-time packages and dispatch Dr. Skelton consultation links."
        />
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Gross Revenue */}
        <div className="rounded-card border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-body">
              Total Revenue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-tint text-primary">
              <DollarSignIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-serif text-ink">${totalRevenue.toLocaleString()}</p>
          <p className="mt-1 text-[11px] text-body">One-time package sales</p>
        </div>

        {/* Basic Purchases */}
        <div className="rounded-card border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-body">
              Basic ($49)
            </span>
            <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-bold text-body">
              Single Send
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-serif text-ink">{basicCount}</p>
          <p className="mt-1 text-[11px] text-body">${basicCount * 49} USD total</p>
        </div>

        {/* Standard Purchases */}
        <div className="rounded-card border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-body">
              Standard ($79)
            </span>
            <span className="rounded-full bg-primary-tint px-2 py-0.5 text-[10px] font-bold text-primary">
              With Resources
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold font-serif text-ink">{standardCount}</p>
          <p className="mt-1 text-[11px] text-body">${standardCount * 79} USD total</p>
        </div>

        {/* Premium Purchases */}
        <div className="rounded-card border border-line bg-surface p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-body">
              Premium ($149)
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
              <CrownIcon className="h-3.5 w-3.5" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold font-serif text-ink">{premiumCount}</p>
          <p className="mt-1 text-[11px] text-body">${premiumCount * 149} USD total</p>
        </div>

        {/* Pending Consultations */}
        <div
          className={cn(
            'rounded-card border p-4 shadow-xs transition-colors',
            pendingConsultationsCount > 0
              ? 'border-amber-400/50 bg-amber-500/10 dark:bg-amber-950/20'
              : 'border-line bg-surface'
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Pending Links
            </span>
            <AlertCircleIcon className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold font-serif text-ink">{pendingConsultationsCount}</p>
          <p className="mt-1 text-[11px] text-body">
            {pendingConsultationsCount === 1
              ? '1 session requires link email'
              : `${pendingConsultationsCount} sessions require link email`}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tier Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-line bg-surface p-1.5">
          {[
            { id: 'all', label: 'All Packages', count: packagePurchases.length },
            { id: 'basic', label: 'Basic ($49)', count: basicCount },
            { id: 'standard', label: 'Standard ($79)', count: standardCount },
            { id: 'premium', label: 'Premium ($149)', count: premiumCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTier(tab.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors',
                selectedTier === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-body hover:bg-canvas hover:text-ink'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px]',
                  selectedTier === tab.id ? 'bg-white/20 text-white' : 'bg-line text-body'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[280px]">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, email, or transaction ID…"
            className="w-full rounded-2xl border border-line bg-surface py-2 pl-9 pr-8 text-xs text-ink placeholder:text-subtle focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-subtle hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Purchases Table */}
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-body">
            <thead className="border-b border-line bg-canvas/60 text-[11px] font-semibold uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-5 py-3.5">Customer & Contact</th>
                <th className="px-4 py-3.5">Package Tier</th>
                <th className="px-4 py-3.5">Amount & Date</th>
                <th className="px-4 py-3.5">Dr. Skelton Consultation</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => {
                  const isPremium = purchase.packageTier === 'premium';
                  const isStandard = purchase.packageTier === 'standard';

                  return (
                    <tr key={purchase.id} className="transition-colors hover:bg-canvas/40">
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shadow-xs',
                              isPremium
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                                : isStandard
                                ? 'bg-primary-tint text-primary'
                                : 'bg-line text-body'
                            )}
                          >
                            {purchase.customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{purchase.customerName}</p>
                            <p className="text-[11px] text-body">{purchase.customerEmail}</p>
                            {purchase.customerPhone && (
                              <p className="text-[10px] text-subtle">{purchase.customerPhone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Package Tier */}
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                            isPremium
                              ? 'border border-amber-400/40 bg-amber-500/10 text-amber-800 dark:text-amber-300'
                              : isStandard
                              ? 'border border-primary/30 bg-primary-tint text-primary'
                              : 'border border-line bg-canvas text-body'
                          )}
                        >
                          {isPremium && <CrownIcon className="h-3 w-3 text-amber-600" />}
                          {purchase.packageName}
                        </span>
                        {purchase.topicName && (
                          <p className="mt-1 text-[11px] text-subtle truncate max-w-[170px]">
                            Topic: {purchase.topicName}
                          </p>
                        )}
                      </td>

                      {/* Amount & Date */}
                      <td className="px-4 py-4">
                        <p className="font-bold text-ink text-sm">${purchase.amount} USD</p>
                        <p className="text-[11px] text-subtle">{purchase.purchasedAt}</p>
                      </td>

                      {/* Dr. Skelton Consultation Status */}
                      <td className="px-4 py-4">
                        {isPremium ? (
                          purchase.consultationSent ? (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2Icon className="h-3 w-3" />
                                Link Emailed
                              </span>
                              {purchase.consultationLink && (
                                <a
                                  href={purchase.consultationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-1 flex items-center gap-1 text-[11px] text-primary hover:underline"
                                >
                                  <span>View Meet Link</span>
                                  <ExternalLinkIcon className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 animate-pulse">
                                <ClockIcon className="h-3 w-3" />
                                Link Pending Dispatch
                              </span>
                              <p className="mt-1 text-[10px] text-subtle">
                                Needs Dr. Skelton session link
                              </p>
                            </div>
                          )
                        ) : (
                          <span className="text-[11px] text-subtle italic">
                            Not included in tier
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isPremium && (
                            <button
                              type="button"
                              onClick={() => handleOpenConsultationModal(purchase)}
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs transition-transform hover:scale-[1.02] active:scale-[0.98]',
                                purchase.consultationSent
                                  ? 'border border-line bg-canvas text-body hover:border-primary hover:text-primary'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              )}
                            >
                              <MailIcon className="h-3.5 w-3.5" />
                              <span>{purchase.consultationSent ? 'Resend Link' : 'Send Email Link'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setActiveDetailsModal(purchase)}
                            title="View Full Purchase Record"
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-line text-body hover:border-primary hover:text-ink"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-subtle">
                    <ShoppingBagIcon className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p className="font-semibold text-ink">No package purchases found</p>
                    <p className="text-xs mt-1">Try resetting the filters or clearing the search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Consultation Email Modal (For Premium Purchases) */}
      {activeConsultationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-card border border-line bg-surface p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                  <CrownIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">
                    Email Dr. Skelton Consultation Link
                  </h3>
                  <p className="text-xs text-body">
                    Send private meeting link to{' '}
                    <strong className="text-ink">{activeConsultationModal.customerName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveConsultationModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-body hover:text-ink"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSendConsultationEmail} className="mt-5 space-y-4 text-xs">
              {/* Recipient Email Display */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink text-[11px]">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={activeConsultationModal.customerEmail}
                  className="mt-1 w-full rounded-xl border border-line bg-canvas px-3.5 py-2 text-xs text-body opacity-80"
                />
              </div>

              {/* Consultation Link Input */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink text-[11px]">
                  Dr. Skelton Meeting / Telehealth Link *
                </label>
                <div className="relative mt-1">
                  <input
                    type="url"
                    required
                    value={consultationLinkInput}
                    onChange={(e) => setConsultationLinkInput(e.target.value)}
                    placeholder="https://meet.google.com/drs-skelton-session or https://calendly.com/dr-skelton/session"
                    className="w-full rounded-xl border border-line bg-surface px-3.5 py-2 pl-9 text-xs text-ink font-medium focus:border-primary focus:outline-none"
                  />
                  <ExternalLinkIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
                </div>
                <p className="mt-1 text-[11px] text-subtle">
                  Google Meet, Zoom, Calendly, or direct telehealth portal URL.
                </p>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink text-[11px]">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={consultationSubject}
                  onChange={(e) => setConsultationSubject(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-surface px-3.5 py-2 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-ink text-[11px]">
                  Personal Message & Instructions *
                </label>
                <textarea
                  rows={6}
                  required
                  value={consultationMessage}
                  onChange={(e) => setConsultationMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-line bg-surface p-3 text-xs leading-relaxed text-ink focus:border-primary focus:outline-none"
                />
              </div>

              {/* Customer Notes (if provided at purchase) */}
              {activeConsultationModal.consultationNotes && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-[11px] text-body">
                  <p className="font-semibold text-ink">Customer Note from Checkout:</p>
                  <p className="mt-0.5">{activeConsultationModal.consultationNotes}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setActiveConsultationModal(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-body hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 disabled:opacity-60"
                >
                  <SendIcon className="h-3.5 w-3.5" />
                  <span>{isSending ? 'Sending Email…' : 'Send Consultation Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Full Details Modal */}
      {activeDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">Purchase Record Details</h3>
                <p className="text-xs text-body font-mono mt-0.5">{activeDetailsModal.transactionId}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDetailsModal(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-body hover:text-ink"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Customer</span>
                <span className="font-semibold text-ink">{activeDetailsModal.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Email</span>
                <span className="font-semibold text-ink">{activeDetailsModal.customerEmail}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Package Tier</span>
                <span className="font-semibold text-ink">{activeDetailsModal.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Amount Paid</span>
                <span className="font-bold text-primary text-sm">${activeDetailsModal.amount} USD</span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Payment Method</span>
                <span className="font-semibold text-ink capitalize">
                  {activeDetailsModal.paymentMethod.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between border-b border-line/60 pb-2">
                <span className="text-subtle">Purchased At</span>
                <span className="text-ink">{activeDetailsModal.purchasedAt}</span>
              </div>
              {activeDetailsModal.topicName && (
                <div className="flex justify-between border-b border-line/60 pb-2">
                  <span className="text-subtle">Dispatched Topic</span>
                  <span className="font-semibold text-ink">{activeDetailsModal.topicName}</span>
                </div>
              )}
              {activeDetailsModal.packageTier === 'premium' && (
                <div className="flex justify-between border-b border-line/60 pb-2">
                  <span className="text-subtle">Consultation Link Status</span>
                  <span
                    className={cn(
                      'font-semibold',
                      activeDetailsModal.consultationSent ? 'text-emerald-600' : 'text-amber-600'
                    )}
                  >
                    {activeDetailsModal.consultationSent
                      ? `Sent on ${activeDetailsModal.consultationSentAt}`
                      : 'Pending Dispatch'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setActiveDetailsModal(null)}
                className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
