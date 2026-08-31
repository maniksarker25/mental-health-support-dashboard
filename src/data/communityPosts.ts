import type { IAdminCommunityPost } from '../types';

export const initialCommunityPosts: IAdminCommunityPost[] = [
  {
    id: 'cpost-1',
    author: 'QuietOak_32',
    title: 'How do you handle sudden physical panic attacks in public spaces?',
    content:
      'I was on the subway this morning and felt intense chest tightness and dizziness hit out of nowhere. I had to get off three stops early. What grounding rituals or subtle techniques do you use when you cannot easily lie down or close your eyes in a crowded place?',
    topicTag: 'Grounding in Public',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-08-31T06:30:00Z',
    likes: 18,
    repliesCount: 4,
    status: 'approved',
    reviewedAt: '2026-08-31T07:00:00Z',
    reviewedBy: 'Admin Moderator',
  },
  {
    id: 'cpost-2',
    author: 'Hopeful_Journey',
    title: 'Tips for overcoming the 3:00 AM insomnia worry spiral?',
    content:
      'Every night this week I wake up around 3:15 AM with my brain racing through work emails and catastrophic worst-case scenarios. Staying in bed makes it worse. What concrete steps help break this loop for you?',
    topicTag: 'Sleep & Night Worry',
    createdAt: '2026-08-31T07:45:00Z',
    likes: 22,
    repliesCount: 6,
    status: 'approved',
    reviewedAt: '2026-08-31T08:10:00Z',
    reviewedBy: 'Admin Moderator',
  },
  {
    id: 'cpost-3',
    author: 'GentleBreeze_88',
    title: 'Feeling intense guilt after taking a mental health sick day from work',
    content:
      'I called in sick today because my nervous system was completely overloaded. But instead of resting, I have spent the last four hours pacing and feeling like an imposter and a burden to my team. How do you silence the guilt?',
    topicTag: 'Workplace Guilt & Burnout',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-08-31T08:20:00Z',
    likes: 0,
    repliesCount: 0,
    status: 'pending',
  },
  {
    id: 'cpost-4',
    author: 'Alex_Engineer',
    title: 'Recognizing emotional numbness before complete exhaustion',
    content:
      'For months I thought burnout was just feeling sleepy. It turns out my early sign was cynicism and emotional detachment. Has anyone experienced this gradual detachment?',
    topicTag: 'Burnout Recovery',
    createdAt: '2026-08-31T08:05:00Z',
    likes: 0,
    repliesCount: 0,
    status: 'pending',
  },
  {
    id: 'cpost-5',
    author: 'Anonymous_Seeker',
    title: 'Can someone recommend specific prescription medication brands for severe panic?',
    content:
      'Looking for recommendations on exact medication dosages and brands to ask my doctor for. Please list what works best.',
    topicTag: 'Medication Advice',
    createdAt: '2026-08-30T14:15:00Z',
    likes: 0,
    repliesCount: 0,
    status: 'needs_update',
    feedback:
      'Please rephrase your post to ask about general discussion experiences rather than seeking or giving specific prescription drug brand/dosage recommendations, per our safety policy.',
    reviewedAt: '2026-08-30T15:00:00Z',
    reviewedBy: 'Clinical Safety Lead',
  },
  {
    id: 'cpost-6',
    author: 'Spam_User_99',
    title: 'Buy guaranteed herbal miracle cures for depression online now',
    content:
      'Click this link to purchase unverified supplements guaranteed to cure clinical anxiety in 24 hours without therapy.',
    topicTag: 'Commercial Promo',
    createdAt: '2026-08-29T11:00:00Z',
    likes: 0,
    repliesCount: 0,
    status: 'rejected',
    rejectionReason: 'Violates community policy on unverified commercial sales and misleading claims.',
    reviewedAt: '2026-08-29T11:30:00Z',
    reviewedBy: 'Admin Moderator',
  },
];
