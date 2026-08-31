import type { IAdminTopic, IArticleResource } from '../types';

export const initialAdminTopics: IAdminTopic[] = [
  {
    id: 'topic-anxiety',
    name: 'Anxiety & Panic',
    tone: 'sky',
    icon: 'Wind',
    description: 'Understanding acute panic attacks, physical fear loops, and vagal nerve downshift tools.',
    status: 'published',
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-08-25T14:30:00Z',
  },
  {
    id: 'topic-depression',
    name: 'Depression & Low Mood',
    tone: 'lavender',
    icon: 'CloudRain',
    description: 'When the volume of reward drops: behavioural activation and gentle daily floors.',
    status: 'published',
    createdAt: '2026-06-05T11:00:00Z',
    updatedAt: '2026-08-26T09:15:00Z',
  },
  {
    id: 'topic-burnout',
    name: 'Burnout & Work Stress',
    tone: 'sand',
    icon: 'BatteryLow',
    description: 'The cost of running without active recovery: boundary templates and demand reduction.',
    status: 'published',
    createdAt: '2026-06-10T14:20:00Z',
    updatedAt: '2026-08-27T16:00:00Z',
  },
  {
    id: 'topic-trauma',
    name: 'Trauma & PTSD',
    tone: 'lavender',
    icon: 'ShieldAlert',
    description: 'Threat memory without a timestamp: present-tense orienting and grounding toolkits.',
    status: 'published',
    createdAt: '2026-06-15T08:45:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
  },
  {
    id: 'topic-grief',
    name: 'Grief & Loss',
    tone: 'blush',
    icon: 'HeartCrack',
    description: 'Carrying what cannot be fixed: oscillation between loss and life with baseline care.',
    status: 'published',
    createdAt: '2026-06-20T13:10:00Z',
    updatedAt: '2026-08-29T10:30:00Z',
  },
  {
    id: 'topic-sleep',
    name: 'Sleep & Insomnia',
    tone: 'sky',
    icon: 'Moon',
    description: 'Getting out of your own way at 3:00 AM: stimulus control and light anchoring.',
    status: 'published',
    createdAt: '2026-06-25T15:00:00Z',
    updatedAt: '2026-08-30T11:20:00Z',
  },
  {
    id: 'topic-loneliness',
    name: 'Loneliness & Isolation',
    tone: 'sand',
    icon: 'Users',
    description: 'The gap between contact and connection: repeat-exposure anchors and depth questions.',
    status: 'published',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-08-30T15:45:00Z',
  },
  {
    id: 'topic-ocd',
    name: 'OCD & Intrusive Thoughts',
    tone: 'mist',
    icon: 'Repeat',
    description: 'The trap of certainty: breaking reassurance loops and practicing uncertainty tolerance.',
    status: 'draft',
    createdAt: '2026-07-10T12:30:00Z',
    updatedAt: '2026-08-31T07:15:00Z',
  },
];

export const initialArticleResources: IArticleResource[] = [
  {
    id: 'res-anxiety-1',
    topicId: 'topic-anxiety',
    topicName: 'Anxiety & Panic',
    title: 'Anxiety & Panic: When Your Body Sounds a False Alarm',
    shortDescription: 'Understanding the physical machinery of fear — and how to turn the volume down.',
    contentHtml: `
<h2>Overview</h2>
<p>Anxiety is the body preparing for a threat that has not arrived. That preparation is not imaginary — the heart really does beat faster, the chest really does tighten, thinking really does narrow. What is inaccurate is the size of the threat, not the sensation.</p>
<p>Roughly one in five adults lives with an anxiety condition in any given year. It is the most common and most treatable group of mental health conditions, and most people improve substantially with structured tools.</p>

<h2>What is happening in your body</h2>
<p>The amygdala flags something as dangerous and triggers a surge of adrenaline before the thinking brain has weighed in. Blood is redirected to large muscles, breathing quickens to load oxygen, and digestion slows.</p>
<p>A panic attack is that surge at full volume. It peaks around ten minutes and cannot physically sustain itself — the body runs out of adrenaline.</p>

<h2>Signs & Patterns to Notice</h2>
<ul>
  <li><strong>[Body] Racing or pounding heart:</strong> Frequently mistaken for a cardiac event.</li>
  <li><strong>[Body] Shallow chest breathing:</strong> Upper-chest breaths creating light-headedness.</li>
  <li><strong>[Mind] Catastrophic forecasting:</strong> The mind jumping to the worst possible outcome.</li>
  <li><strong>[Behavior] Quiet avoidance:</strong> Declining plans, delaying calls, or leaving early.</li>
</ul>

<h2>Evidence-Based Coping Strategies</h2>
<ol>
  <li><strong>The 5-4-3-2-1 Grounding Scan:</strong> Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.</li>
  <li><strong>Extended Exhale Breathing:</strong> Inhale 4s through the nose, exhale 8s through slightly parted lips.</li>
  <li><strong>Scheduled Worry Window:</strong> Pick 15 minutes each afternoon to contain all rumination.</li>
</ol>
    `.trim(),
    readingTime: 8,
    status: 'published',
    createdAt: '2026-06-02T10:00:00Z',
    updatedAt: '2026-08-25T14:30:00Z',
  },
  {
    id: 'res-depression-1',
    topicId: 'topic-depression',
    topicName: 'Depression & Low Mood',
    title: 'Depression: When the Volume of Everything Drops',
    shortDescription: 'Why motivation disappears before mood recovers, and how to work with that order.',
    contentHtml: `
<h2>Overview</h2>
<p>People often expect depression to feel like crying. More often it feels like nothing: food without taste, music without pull, a to-do list that may as well be in another language.</p>
<p>That absence is a symptom, not a personality. Depression narrows the brain’s reward signalling, so activities that used to pay off no longer register — which makes withdrawal feel rational and deepens the loop.</p>

<h2>Why willpower is the wrong lever</h2>
<p>In depression, the anticipation of reward dims before the capacity for it does. You can still enjoy a walk; you simply cannot feel in advance that you would. Waiting to feel like it means waiting for the last symptom to lift first.</p>
<p>Behavioural activation works because small scheduled actions taken without motivation slowly restore the reward signal. Mood follows movement rather than leading it.</p>

<h2>Practical Coping Tools</h2>
<ul>
  <li><strong>The Two-Minute Floor:</strong> Choose one anchor task (teeth, shower, one glass of water) with permission to stop after 2 minutes.</li>
  <li><strong>Thought-Record Reframing:</strong> Write the harsh thought verbatim, then note objective counter-evidence.</li>
</ul>
    `.trim(),
    readingTime: 7,
    status: 'published',
    createdAt: '2026-06-06T11:00:00Z',
    updatedAt: '2026-08-26T09:15:00Z',
  },
  {
    id: 'res-burnout-1',
    topicId: 'topic-burnout',
    topicName: 'Burnout & Work Stress',
    title: 'Burnout & Chronic Stress: Running Without Recovery',
    shortDescription: 'Exhaustion, cynicism, and dwindling effectiveness — and how to reverse them.',
    contentHtml: `
<h2>Overview</h2>
<p>Burnout is not simply being tired. The World Health Organization defines it as a syndrome from chronic workplace stress that has not been successfully managed, with three parts: exhaustion, mental distance or cynicism, and reduced effectiveness.</p>
<h2>Why a weekend does not reset it</h2>
<p>Under sustained load, cortisol regulation shifts. Recovery becomes slower and less complete, so each week starts from a deficit. Genuine recovery needs both demand reduction and restorative sleep.</p>
<h2>Boundary Script Templates</h2>
<blockquote>
  <p>“I can take this on if we move X — which would you prefer?”</p>
  <p>“I am at capacity this week. I can start Monday.”</p>
</blockquote>
    `.trim(),
    readingTime: 6,
    status: 'published',
    createdAt: '2026-06-12T14:20:00Z',
    updatedAt: '2026-08-27T16:00:00Z',
  },
  {
    id: 'res-sleep-1',
    topicId: 'topic-sleep',
    topicName: 'Sleep & Insomnia',
    title: 'Sleep & Insomnia: Getting Out of Your Own Way at 3:00 AM',
    shortDescription: 'Why trying harder to sleep keeps you awake, and what retrains the system.',
    contentHtml: `
<h2>Overview</h2>
<p>Sleep cannot be produced by effort. It arrives when pressure to sleep is high and arousal is low. Lying awake in frustration strengthens the association between bed and vigilance.</p>
<h2>Stimulus Control Practice</h2>
<p>If awake for more than 20 minutes, get out of bed in dim light, sit in a comfortable chair, and return only when drowsy. Keep the same wake time regardless of how the night went.</p>
    `.trim(),
    readingTime: 7,
    status: 'published',
    createdAt: '2026-06-26T15:00:00Z',
    updatedAt: '2026-08-30T11:20:00Z',
  },
];
