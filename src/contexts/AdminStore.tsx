import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { initialTopics } from '../data/topics';
import { initialHotlines, initialLegalDocs } from '../data/legal';
import { initialProfile } from '../data/system';
import type { AdminProfile, Hotline, LegalDoc, LegalDocId, Topic } from '../types';

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
  changePassword: (current: string, next: string) => {ok: boolean;message: string;};
}

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

/** Demo-only credential so the change-password flow can be exercised end to end. */
const DEMO_PASSWORD = 'Anonymous2026!';

const nowIso = () => new Date().toISOString();
const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function AdminStoreProvider({ children }: {children: React.ReactNode;}) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [legalDocs, setLegalDocs] = useState<LegalDoc[]>(initialLegalDocs);
  const [hotlines, setHotlines] = useState<Hotline[]>(initialHotlines);
  const [profile, setProfile] = useState<AdminProfile>(initialProfile);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [passwordUpdatedAt, setPasswordUpdatedAt] = useState('2026-06-02T10:12:00Z');

  const saveTopic = useCallback((topic: Topic) => {
    setTopics((prev) => {
      const stamped = { ...topic, updatedAt: nowIso() };
      const exists = prev.some((t) => t.id === topic.id);
      return exists ? prev.map((t) => t.id === topic.id ? stamped : t) : [stamped, ...prev];
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
    setLegalDocs((prev) => prev.map((d) => d.id === id ? { ...d, html, updatedAt: nowIso() } : d));
  }, []);

  const saveHotline = useCallback((hotline: Hotline) => {
    setHotlines((prev) => prev.map((h) => h.id === hotline.id ? hotline : h));
  }, []);

  const saveProfile = useCallback((next: AdminProfile) => {
    setProfile({
      ...next,
      initials: next.name.
      split(' ').
      filter(Boolean).
      map((part) => part[0]?.toUpperCase() ?? '').
      slice(0, 2).
      join('')
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
      changePassword
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
    changePassword]

  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

export function useAdminStore(): AdminStoreValue {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error('useAdminStore must be used inside AdminStoreProvider');
  return ctx;
}