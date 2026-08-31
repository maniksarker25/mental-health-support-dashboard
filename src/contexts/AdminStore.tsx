import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialTopics } from '../data/topics';
import { initialHotlines, initialLegalDocs } from '../data/legal';
import { initialProfile } from '../data/system';
import { initialUsers } from '../data/users';
import { initialMessages } from '../data/messages';
import { initialReports } from '../data/reports';
import { initialAdminTopics, initialArticleResources } from '../data/articleResources';
import { initialCommunityPosts } from '../data/communityPosts';
import type {
  AdminMessage,
  AdminProfile,
  AppUser,
  Hotline,
  IAdminCommunityPost,
  IAdminTopic,
  IArticleResource,
  LegalDoc,
  LegalDocId,
  MessageReport,
  ReportReasonCategory,
  Topic,
  UserStatus,
} from '../types';

interface AdminStoreValue {
  topics: Topic[];
  saveTopic: (topic: Topic) => void;
  deleteTopic: (id: string) => void;
  duplicateTopic: (id: string) => Topic | undefined;

  legalDocs: LegalDoc[];
  saveLegalDoc: (id: LegalDocId, html: string) => void;

  hotlines: Hotline[];
  saveHotline: (hotline: Hotline) => void;

  profile: AdminProfile;
  saveProfile: (profile: AdminProfile) => void;
  passwordUpdatedAt: string;
  changePassword: (current: string, next: string) => { ok: boolean; message: string };

  // User Management
  users: AppUser[];
  toggleUserBlock: (userId: string, reason?: string) => void;
  setUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  addUser: (user: Partial<AppUser> & { name: string; email: string; phone: string }) => AppUser;
  deleteUser: (userId: string) => void;

  // Message Moderation
  messages: AdminMessage[];
  approveMessage: (messageId: string) => void;
  rejectMessage: (messageId: string, reason?: string) => void;
  approveAllPendingMessages: () => number;
  deleteMessage: (messageId: string) => void;

  // Report Management
  reports: MessageReport[];
  submitReport: (report: {
    reportedPersonName: string;
    reportedPersonContact: string;
    reportedByContact: string;
    reportedByChannel: 'sms' | 'email';
    topicTitle: string;
    reasonCategory: ReportReasonCategory;
    reasonText: string;
    messageId?: string;
  }) => MessageReport;
  resolveReport: (reportId: string, notes?: string) => void;
  dismissReport: (reportId: string, notes?: string) => void;
  blockReportedUser: (reportId: string, reason?: string) => void;

  // Topic Management (Create / Update / Delete / Get)
  adminTopics: IAdminTopic[];
  saveAdminTopic: (topic: IAdminTopic) => void;
  deleteAdminTopic: (id: string) => void;

  // Resource Management (Select Topic, Title, Short Description, Jodit Editor HTML Article)
  articleResources: IArticleResource[];
  saveArticleResource: (res: IArticleResource) => void;
  deleteArticleResource: (id: string) => void;
  getArticleResource: (id: string) => IArticleResource | undefined;

  // Community Post Moderation (Approve, Reject, Send Feedback for Update, Delete)
  communityPosts: IAdminCommunityPost[];
  approveCommunityPost: (id: string) => void;
  rejectCommunityPost: (id: string, reason?: string) => void;
  sendFeedbackCommunityPost: (id: string, feedback: string) => void;
  deleteCommunityPost: (id: string) => void;
  approveAllPendingCommunityPosts: () => number;
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

/** Demo-only credential so the change-password flow can be exercised end to end. */
const DEMO_PASSWORD = 'Anonymous2026!';

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [legalDocs, setLegalDocs] = useState<LegalDoc[]>(initialLegalDocs);
  const [hotlines, setHotlines] = useState<Hotline[]>(initialHotlines);
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [passwordUpdatedAt, setPasswordUpdatedAt] = useState('2026-06-02T10:12:00Z');

  // New Entities
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages);
  const [reports, setReports] = useState<MessageReport[]>(initialReports);

  // Topic Management (Create / Update / Delete / Get)
  const [adminTopics, setAdminTopics] = useState<IAdminTopic[]>(initialAdminTopics);

  // Resource Management (Select Topic, Title, Short Description, Jodit Editor HTML Article)
  const [articleResources, setArticleResources] = useState<IArticleResource[]>(initialArticleResources);

  const saveAdminTopic = useCallback((topicData: IAdminTopic) => {
    setAdminTopics((prev) => {
      const stamped = { ...topicData, updatedAt: nowIso() };
      const exists = prev.some((t) => t.id === topicData.id);
      return exists ? prev.map((t) => (t.id === topicData.id ? stamped : t)) : [stamped, ...prev];
    });
  }, []);

  const deleteAdminTopic = useCallback((id: string) => {
    setAdminTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const saveArticleResource = useCallback((resData: IArticleResource) => {
    setArticleResources((prev) => {
      const stamped = { ...resData, updatedAt: nowIso() };
      const exists = prev.some((r) => r.id === resData.id);
      return exists ? prev.map((r) => (r.id === resData.id ? stamped : r)) : [stamped, ...prev];
    });
  }, []);

  const deleteArticleResource = useCallback((id: string) => {
    setArticleResources((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const getArticleResource = useCallback(
    (id: string) => {
      return articleResources.find((r) => r.id === id);
    },
    [articleResources]
  );

  // Community Post Moderation (Approve, Reject, Send Feedback for Update, Delete)
  const [communityPosts, setCommunityPosts] = useState<IAdminCommunityPost[]>(initialCommunityPosts);

  const approveCommunityPost = useCallback((id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'approved',
              reviewedAt: nowIso(),
              reviewedBy: 'Admin Moderator',
              feedback: undefined,
              rejectionReason: undefined,
            }
          : p
      )
    );
  }, []);

  const rejectCommunityPost = useCallback((id: string, reason?: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'rejected',
              rejectionReason: reason || 'Post declined per community guidelines review.',
              reviewedAt: nowIso(),
              reviewedBy: 'Admin Moderator',
            }
          : p
      )
    );
  }, []);

  const sendFeedbackCommunityPost = useCallback((id: string, feedback: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'needs_update',
              feedback: feedback.trim(),
              reviewedAt: nowIso(),
              reviewedBy: 'Admin Moderator',
            }
          : p
      )
    );
  }, []);

  const deleteCommunityPost = useCallback((id: string) => {
    setCommunityPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const approveAllPendingCommunityPosts = useCallback(() => {
    let count = 0;
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.status === 'pending' || p.status === 'needs_update') {
          count++;
          return {
            ...p,
            status: 'approved',
            reviewedAt: nowIso(),
            reviewedBy: 'Admin Moderator (Batch)',
          };
        }
        return p;
      })
    );
    return count;
  }, []);

  const saveTopic = useCallback((topic: Topic) => {
    setTopics((prev) => {
      const stamped = { ...topic, updatedAt: nowIso() };
      const exists = prev.some((t) => t.id === topic.id);
      return exists ? prev.map((t) => (t.id === topic.id ? stamped : t)) : [stamped, ...prev];
    });
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const duplicateTopic = useCallback(
    (id: string) => {
      const source = topics.find((t) => t.id === id);
      if (!source) return undefined;
      const copy: Topic = {
        ...source,
        id: uid('tp'),
        topicTitle: `${source.topicTitle || source.title} (Copy)`,
        resourceTitle: `${source.resourceTitle || source.packetTitle} (Copy)`,
        title: `${source.topicTitle || source.title} (Copy)`,
        packetTitle: `${source.resourceTitle || source.packetTitle} (Copy)`,
        slug: `${source.slug || 'resource'}-copy-${Math.random().toString(36).slice(2, 6)}`,
        status: 'draft',
        isPublished: false,
        updatedAt: nowIso(),
        items: (source.items || []).map((item) => ({ ...item, id: uid('pi') })),
        sections: (source.sections || []).map((sec, idx) => ({
          ...sec,
          id: uid('blk'),
          order: idx,
        })),
      };
      setTopics((prev) => [copy, ...prev]);
      return copy;
    },
    [topics]
  );

  const saveLegalDoc = useCallback((id: LegalDocId, html: string) => {
    setLegalDocs((prev) => prev.map((d) => (d.id === id ? { ...d, html, updatedAt: nowIso() } : d)));
  }, []);

  const saveHotline = useCallback((hotline: Hotline) => {
    setHotlines((prev) => prev.map((h) => (h.id === hotline.id ? hotline : h)));
  }, []);

  const saveProfile = useCallback((next: AdminProfile) => {
    setProfile({
      ...next,
      initials: next.name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join(''),
    });
  }, []);

  const changePassword = useCallback(
    (current: string, next: string) => {
      if (current !== password) {
        return { ok: false, message: 'Your current password is not correct.' };
      }
      if (next === password) {
        return { ok: false, message: 'Choose a password you have not used before.' };
      }
      setPassword(next);
      setPasswordUpdatedAt(nowIso());
      return { ok: true, message: 'Password updated. Other sessions were signed out.' };
    },
    [password]
  );

  // -------------------------------------------------------------
  // User Management Actions
  // -------------------------------------------------------------
  const toggleUserBlock = useCallback((userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        const willBlock = user.status !== 'blocked';
        return {
          ...user,
          status: willBlock ? 'blocked' : 'active',
          blockedAt: willBlock ? nowIso() : undefined,
          blockedReason: willBlock ? reason || 'Blocked by administrator' : undefined,
        };
      })
    );
  }, []);

  const setUserStatus = useCallback((userId: string, status: UserStatus, reason?: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) return user;
        return {
          ...user,
          status,
          blockedAt: status === 'blocked' ? nowIso() : undefined,
          blockedReason: status === 'blocked' ? reason || 'Blocked by administrator' : undefined,
        };
      })
    );
  }, []);

  const addUser = useCallback((data: Partial<AppUser> & { name: string; email: string; phone: string }) => {
    const newUser: AppUser = {
      id: uid('usr'),
      name: data.name,
      email: data.email,
      phone: data.phone,
      initials: data.name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('') || 'U',
      role: data.role || 'member',
      status: 'active',
      joinedAt: nowIso(),
      lastActiveAt: nowIso(),
      messagesSentCount: 0,
      reportsReceivedCount: 0,
      notes: data.notes,
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  // -------------------------------------------------------------
  // Message Moderation Actions
  // -------------------------------------------------------------
  const approveMessage = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: 'approved',
              approvedAt: nowIso(),
              approvedBy: 'Admin Console',
              rejectionReason: undefined,
            }
          : msg
      )
    );
  }, []);

  const rejectMessage = useCallback((messageId: string, reason?: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: 'rejected',
              rejectionReason: reason || 'Declined by administrator during safety moderation review.',
            }
          : msg
      )
    );
  }, []);

  const approveAllPendingMessages = useCallback(() => {
    let count = 0;
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.status === 'pending') {
          count++;
          return {
            ...msg,
            status: 'approved',
            approvedAt: nowIso(),
            approvedBy: 'Admin Console (Batch)',
          };
        }
        return msg;
      })
    );
    return count;
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  // -------------------------------------------------------------
  // Report Management Actions
  // -------------------------------------------------------------
  const submitReport = useCallback(
    (reportData: {
      reportedPersonName: string;
      reportedPersonContact: string;
      reportedByContact: string;
      reportedByChannel: 'sms' | 'email';
      topicTitle: string;
      reasonCategory: ReportReasonCategory;
      reasonText: string;
      messageId?: string;
    }) => {
      // Find matching user ID if exists
      const matchUser = users.find(
        (u) =>
          u.email.toLowerCase() === reportData.reportedPersonContact.toLowerCase() ||
          u.phone === reportData.reportedPersonContact ||
          u.name.toLowerCase() === reportData.reportedPersonName.toLowerCase()
      );

      const newReport: MessageReport = {
        id: uid('rep'),
        messageId: reportData.messageId,
        reportedPersonId: matchUser?.id || uid('usr-reported'),
        reportedPersonName: reportData.reportedPersonName || matchUser?.name || 'Sender',
        reportedPersonContact: reportData.reportedPersonContact || matchUser?.email || matchUser?.phone || 'Unknown Contact',
        reportedByContact: reportData.reportedByContact || 'Anonymous Recipient',
        reportedByChannel: reportData.reportedByChannel,
        topicTitle: reportData.topicTitle,
        reasonCategory: reportData.reasonCategory,
        reasonText: reportData.reasonText,
        reportedAt: nowIso(),
        status: 'new',
      };

      setReports((prev) => [newReport, ...prev]);

      // If user found, increment their reportsReceivedCount
      if (matchUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === matchUser.id ? { ...u, reportsReceivedCount: (u.reportsReceivedCount || 0) + 1 } : u
          )
        );
      }

      return newReport;
    },
    [users]
  );

  const resolveReport = useCallback((reportId: string, notes?: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              status: 'resolved',
              resolutionNotes: notes || 'Reviewed and resolved by administrator.',
              resolvedAt: nowIso(),
            }
          : rep
      )
    );
  }, []);

  const dismissReport = useCallback((reportId: string, notes?: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId
          ? {
              ...rep,
              status: 'resolved',
              resolutionNotes: notes || 'Dismissed as false alarm or duplicate (Resolved).',
              resolvedAt: nowIso(),
            }
          : rep
      )
    );
  }, []);


  const blockReportedUser = useCallback(
    (reportId: string, reason?: string) => {
      const report = reports.find((r) => r.id === reportId);
      if (!report) return;

      const blockExplanation =
        reason || `Blocked following incident report (${report.reasonCategory}): ${report.reasonText}`;

      // 1. Block matching user in users state
      setUsers((prev) =>
        prev.map((u) => {
          const isMatch =
            u.id === report.reportedPersonId ||
            u.email.toLowerCase() === report.reportedPersonContact.toLowerCase() ||
            u.phone === report.reportedPersonContact ||
            u.name.toLowerCase() === report.reportedPersonName.toLowerCase();
          if (!isMatch) return u;
          return {
            ...u,
            status: 'blocked',
            blockedAt: nowIso(),
            blockedReason: blockExplanation,
          };
        })
      );

      // 2. Reject any pending messages from this sender
      setMessages((prev) =>
        prev.map((msg) => {
          const isSender =
            msg.senderId === report.reportedPersonId ||
            msg.senderEmail.toLowerCase() === report.reportedPersonContact.toLowerCase() ||
            msg.senderName.toLowerCase() === report.reportedPersonName.toLowerCase();
          if (isSender && msg.status === 'pending') {
            return {
              ...msg,
              status: 'rejected',
              rejectionReason: 'Sender account blocked due to receiver report violation.',
            };
          }
          return msg;
        })
      );

      // 3. Mark the report as resolved with user blocked note
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: 'resolved',
                resolutionNotes: `Reported sender was blocked. ${blockExplanation}`,
                resolvedAt: nowIso(),
              }
            : r
        )
      );
    },
    [reports]
  );

  const value = useMemo<AdminStoreValue>(
    () => ({
      topics,
      saveTopic,
      deleteTopic,
      duplicateTopic,
      legalDocs,
      saveLegalDoc,
      hotlines,
      saveHotline,
      profile,
      saveProfile,
      passwordUpdatedAt,
      changePassword,
      // Users
      users,
      toggleUserBlock,
      setUserStatus,
      addUser,
      deleteUser,
      // Messages
      messages,
      approveMessage,
      rejectMessage,
      approveAllPendingMessages,
      deleteMessage,
      // Reports
      reports,
      submitReport,
      resolveReport,
      dismissReport,
      blockReportedUser,
      // Topics
      adminTopics,
      saveAdminTopic,
      deleteAdminTopic,
      // Resources
      articleResources,
      saveArticleResource,
      deleteArticleResource,
      getArticleResource,
      // Community Posts
      communityPosts,
      approveCommunityPost,
      rejectCommunityPost,
      sendFeedbackCommunityPost,
      deleteCommunityPost,
      approveAllPendingCommunityPosts,
    }),
    [
      topics,
      saveTopic,
      deleteTopic,
      duplicateTopic,
      legalDocs,
      saveLegalDoc,
      hotlines,
      saveHotline,
      profile,
      saveProfile,
      passwordUpdatedAt,
      changePassword,
      users,
      toggleUserBlock,
      setUserStatus,
      addUser,
      deleteUser,
      messages,
      approveMessage,
      rejectMessage,
      approveAllPendingMessages,
      deleteMessage,
      reports,
      submitReport,
      resolveReport,
      dismissReport,
      blockReportedUser,
      adminTopics,
      saveAdminTopic,
      deleteAdminTopic,
      articleResources,
      saveArticleResource,
      deleteArticleResource,
      getArticleResource,
      communityPosts,
      approveCommunityPost,
      rejectCommunityPost,
      sendFeedbackCommunityPost,
      deleteCommunityPost,
      approveAllPendingCommunityPosts,
    ]
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore(): AdminStoreValue {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used inside AdminStoreProvider');
  return ctx;
}