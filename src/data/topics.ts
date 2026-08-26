import type {
  TopicAndResource,
  ToneKey,
  ResourceBlockType,
  ResourceLayoutStyle,
  IResourceBlock,
} from '../types';

export const TONE_KEYS: ToneKey[] = ['sky', 'lavender', 'sand', 'blush', 'mist'];

export const TONE_META: Record<
  ToneKey,
  { label: string; usage: string; chip: string; swatch: string; gradient: string; heroBg: string; border: string; text: string; badgeBg: string }
> = {
  sky: {
    label: 'Sky',
    usage: 'Anxiety, Eating Disorders',
    chip: 'bg-sky-bg border-sky-line text-sky-text',
    swatch: 'bg-sky-bg border-sky-line',
    gradient: 'from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/40 dark:to-slate-900',
    heroBg: 'bg-sky-100/60 dark:bg-sky-950/40',
    border: 'border-sky-200 dark:border-sky-800/60',
    text: 'text-sky-700 dark:text-sky-300',
    badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  },
  lavender: {
    label: 'Lavender',
    usage: 'Depression, Trauma',
    chip: 'bg-lavender-bg border-lavender-line text-lavender-text',
    swatch: 'bg-lavender-bg border-lavender-line',
    gradient: 'from-purple-50 via-indigo-50 to-pink-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900',
    heroBg: 'bg-purple-100/60 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/60',
    text: 'text-purple-700 dark:text-purple-300',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  },
  sand: {
    label: 'Sand',
    usage: 'Stress & Burnout',
    chip: 'bg-sand-bg border-sand-line text-sand-text',
    swatch: 'bg-sand-bg border-sand-line',
    gradient: 'from-amber-50 via-orange-50 to-stone-50 dark:from-slate-900 dark:via-amber-950/40 dark:to-slate-900',
    heroBg: 'bg-amber-100/60 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/60',
    text: 'text-amber-700 dark:text-amber-300',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  },
  blush: {
    label: 'Blush',
    usage: 'Grief & Loss',
    chip: 'bg-blush-bg border-blush-line text-blush-text',
    swatch: 'bg-blush-bg border-blush-line',
    gradient: 'from-rose-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-rose-950/40 dark:to-slate-900',
    heroBg: 'bg-rose-100/60 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800/60',
    text: 'text-rose-700 dark:text-rose-300',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  },
  mist: {
    label: 'Mist',
    usage: 'Substance Abuse, Dementia',
    chip: 'bg-mist-bg border-mist-line text-mist-text',
    swatch: 'bg-mist-bg border-mist-line',
    gradient: 'from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-teal-950/40 dark:to-slate-900',
    heroBg: 'bg-teal-100/60 dark:bg-teal-950/40',
    border: 'border-teal-200 dark:border-teal-800/60',
    text: 'text-teal-700 dark:text-teal-300',
    badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  },
};

export const BLOCK_TYPE_META: Record<
  ResourceBlockType,
  { label: string; description: string; icon: string; defaultLayout: ResourceLayoutStyle }
> = {
  hero_section: {
    label: 'Hero Header',
    description: 'Impactful headline, subtitle, and optional hero background image.',
    icon: 'Sparkles',
    defaultLayout: 'full_width',
  },
  intro_section: {
    label: 'Intro & Summary',
    description: 'Empathetic overview describing what this condition is and who it affects.',
    icon: 'Info',
    defaultLayout: 'container_centered',
  },
  interactive_grounding_tool: {
    label: 'Interactive Breathing & Grounding Pacer',
    description: 'Live interactive animated visual breathing tool (4-7-8, Box Breathing) for acute relief.',
    icon: 'Wind',
    defaultLayout: 'container_centered',
  },
  coping_strategies: {
    label: 'Coping Strategies',
    description: 'Actionable, evidence-based coping tools to practice right away.',
    icon: 'Heart',
    defaultLayout: 'card_grid',
  },
  myths_vs_facts: {
    label: 'Myths vs. Facts',
    description: 'Side-by-side clinical destigmatization dispelling common harmful misconceptions.',
    icon: 'CheckCircle',
    defaultLayout: 'default',
  },
  symptoms_grid: {
    label: 'Symptoms & Experiences',
    description: 'Card grid of physical, emotional, and psychological sensations.',
    icon: 'Activity',
    defaultLayout: 'grid_3_col',
  },
  warning_signs: {
    label: 'Warning Signs',
    description: 'Alert cards highlighting when symptoms may require professional attention.',
    icon: 'AlertTriangle',
    defaultLayout: 'grid_2_col',
  },
  info_cards: {
    label: 'Key Concepts / Info Cards',
    description: 'Highlight cards breaking down core insights and terminology.',
    icon: 'Layers',
    defaultLayout: 'card_grid',
  },
  image_text: {
    label: 'Image & Text Split',
    description: 'Side-by-side illustrated story or clinical explanation with responsive flow.',
    icon: 'Image',
    defaultLayout: 'two_column_split',
  },
  quote_callout: {
    label: 'Empathetic Quote',
    description: 'Prominent quote callout designed to comfort, destigmatize, and reassure.',
    icon: 'Quote',
    defaultLayout: 'accent_bg',
  },
  rich_text_jodit: {
    label: 'Rich Text Article',
    description: 'WYSIWYG article formatted with headings, lists, bold text, and hyperlinks.',
    icon: 'FileText',
    defaultLayout: 'default',
  },
  treatment_options: {
    label: 'Treatment Pathways',
    description: 'Clear breakdown of therapy approaches, clinical support, and medication.',
    icon: 'Stethoscope',
    defaultLayout: 'grid_2_col',
  },
  supporting_someone: {
    label: 'How to Support Someone',
    description: 'Practical guidance for friends, family, and loved ones on what to do and say.',
    icon: 'UserCheck',
    defaultLayout: 'default',
  },
  faq_accordion: {
    label: 'Frequently Asked Questions',
    description: 'Interactive collapsible FAQ accordion answering common questions.',
    icon: 'HelpCircle',
    defaultLayout: 'default',
  },
  resource_links: {
    label: 'Helplines & Resources',
    description: 'Directory of trusted organizations, hotlines, websites, and articles.',
    icon: 'ExternalLink',
    defaultLayout: 'grid_2_col',
  },
  crisis_banner: {
    label: 'Emergency Crisis Alert',
    description: 'High-visibility safety banner with instant 24/7 hotline numbers and dial links.',
    icon: 'ShieldAlert',
    defaultLayout: 'full_width',
  },
  cta_banner: {
    label: 'Next Step / CTA Banner',
    description: 'Action banner with a button leading to care pathways or crisis tools.',
    icon: 'ArrowRightCircle',
    defaultLayout: 'accent_bg',
  },
  video: {
    label: 'Video Resource',
    description: 'Embedded educational video or guided mindfulness session.',
    icon: 'Video',
    defaultLayout: 'container_centered',
  },
  disclaimer: {
    label: 'Clinical Disclaimer',
    description: 'Standard medical liability notice and crisis referral note.',
    icon: 'Shield',
    defaultLayout: 'default',
  },
};

export const LAYOUT_STYLE_OPTIONS: { value: ResourceLayoutStyle; label: string }[] = [
  { value: 'default', label: 'Standard Container' },
  { value: 'full_width', label: 'Full Width Bleed' },
  { value: 'container_centered', label: 'Centered Narrow' },
  { value: 'two_column_split', label: 'Two Column Split' },
  { value: 'grid_2_col', label: '2-Column Grid' },
  { value: 'grid_3_col', label: '3-Column Grid' },
  { value: 'grid_4_col', label: '4-Column Grid' },
  { value: 'card_grid', label: 'Floating Card Grid' },
  { value: 'accent_bg', label: 'Toned Accent Background' },
];

export const ICON_CHOICES = [
  'Wind',
  'CloudRain',
  'Flame',
  'HeartHandshake',
  'ShieldHalf',
  'BrainCog',
  'Waves',
  'Utensils',
  'Sunrise',
  'Leaf',
  'Moon',
  'Anchor',
  'Shield',
  'Heart',
  'Sparkles',
  'Activity',
  'BookOpen',
  'Sun',
] as const;

export function createDefaultBlock(blockType: ResourceBlockType, order: number = 0): IResourceBlock {
  const id = `blk-${Math.random().toString(36).slice(2, 9)}`;
  const defaultLayout = BLOCK_TYPE_META[blockType]?.defaultLayout || 'default';

  switch (blockType) {
    case 'hero_section':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          hero: {
            headline: 'You Are Not Alone in This',
            subheadline: 'A comprehensive, clinically grounded guide delivered to support you right now.',
            bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
          },
        },
      };

    case 'intro_section':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          intro: {
            title: 'Understanding What You Are Experiencing',
            description:
              'Someone who cares deeply about you sent this resource. You do not owe anyone a response or explanation. This page is here simply to provide clarity, comfort, and evidence-based steps forward.',
          },
        },
      };

    case 'interactive_grounding_tool':
      return {
        id,
        blockType,
        order,
        layoutStyle: 'container_centered',
        content: {
          groundingTool: {
            title: 'Live 4-7-8 Calming Breath Pacer',
            description: 'A direct neurological switch into the calming parasympathetic branch of your nervous system.',
            technique: '4-7-8',
            guidanceText: 'Breathe in quietly through the nose for 4 counts, hold your breath for 7 counts, and exhale completely with a whoosh for 8 counts.',
          },
        },
      };

    case 'myths_vs_facts':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          mythsFacts: {
            title: 'Myths vs. Clinical Realities',
            description: 'Dispelling common misconceptions to reduce shame and self-blame.',
            items: [
              {
                id: 'mf-1',
                myth: 'Anxiety is just overthinking or being dramatic.',
                fact: 'Anxiety is an involuntary nervous system response involving real physiological adrenaline release.',
              },
              {
                id: 'mf-2',
                myth: 'You should be able to snap out of it with willpower.',
                fact: 'Willpower does not reset neurochemistry; evidence-based behavioral tools and compassion do.',
              },
            ],
          },
        },
      };

    case 'rich_text_jodit':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          richTextHtml: `<h2>Understanding What Is Happening</h2><p>Our nervous system is designed to protect us, but sometimes it activates when no physical danger exists. Naming what is happening is the fastest route to relief.</p><h3>Key Things to Remember</h3><ul><li><strong>Your feelings are valid.</strong> You do not need to justify how you feel to anyone.</li><li><strong>Recovery is a gradual process.</strong> Small, sustainable steps matter more than giant leaps.</li></ul>`,
        },
      };

    case 'symptoms_grid':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          symptoms: [
            { id: 's1', title: 'Racing Thoughts', description: 'Difficulty slowing down mental chatter or jumping between worst-case scenarios.' },
            { id: 's2', title: 'Physical Tension', description: 'Tight shoulders, shallow breathing, rapid heart rate, or clenched jaw.' },
            { id: 's3', title: 'Energy Depletion', description: 'Feeling deeply drained even after resting or getting hours of sleep.' },
          ],
        },
      };

    case 'warning_signs':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          warningSigns: [
            { id: 'w1', title: 'Persistent Sleep Disruption', description: 'Consistently unable to fall asleep or waking up with panic for over 2 weeks.' },
            { id: 'w2', title: 'Social Withdrawal', description: 'Canceling plans repeatedly and feeling overwhelmed by basic conversations.' },
            { id: 'w3', title: 'Feelings of Hopelessness', description: 'Feeling as though things will never improve or struggling to find motivation.' },
          ],
        },
      };

    case 'info_cards':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          features: [
            { id: 'f1', title: 'Protective Response', description: 'Your brain is trying to keep you safe with adrenaline, not trying to harm you.' },
            { id: 'f2', title: 'Highly Treatable', description: 'Modern behavioral therapies and grounding protocols offer remarkable recovery rates.' },
          ],
        },
      };

    case 'image_text':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          imageText: {
            title: 'Reframing the Moment',
            description:
              'When adrenaline peaks, the prefrontal cortex temporarily takes a backseat. Taking slow, prolonged exhales signals your vagus nerve to restore balance.',
            imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&auto=format&fit=crop&q=80',
            imagePosition: 'right',
          },
        },
      };

    case 'quote_callout':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          quote: {
            text: 'You do not have to control your thoughts. You just have to stop letting them control you.',
            author: 'Dan Millman',
          },
        },
      };

    case 'coping_strategies':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          copingStrategies: [
            { id: 'c1', title: '4-7-8 Breathing', description: 'Inhale through nose for 4 counts, hold for 7, exhale slowly through mouth for 8.' },
            { id: 'c2', title: '5-4-3-2-1 Sensory Grounding', description: 'Acknowledge 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste.' },
            { id: 'c3', title: 'Cold Water Reset', description: 'Splash cold water on your face or hold an ice cube to stimulate the mammalian dive reflex.' },
          ],
        },
      };

    case 'treatment_options':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          treatmentOptions: [
            { id: 't1', title: 'Cognitive Behavioral Therapy (CBT)', description: 'Practical, structured dialogue to identify and reframe unhelpful thought patterns.' },
            { id: 't2', title: 'Acceptance & Commitment Therapy (ACT)', description: 'Learning to accept thoughts without judgment while taking values-driven actions.' },
            { id: 't3', title: 'Medical Consultation', description: 'Discussing safe, evidence-based medication options with a qualified healthcare provider.' },
          ],
        },
      };

    case 'supporting_someone':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          supportingSomeone: {
            title: 'If You Are Supporting a Loved One',
            description: 'Simple ways to offer compassionate presence without overstepping.',
            tips: [
              { id: 'tip1', title: 'Listen without trying to fix', description: 'Say: "That sounds really exhausting, I am here with you."' },
              { id: 'tip2', title: 'Offer concrete small gestures', description: 'Say: "Can I bring you lunch on Tuesday?" rather than "Let me know if you need anything."' },
            ],
          },
        },
      };

    case 'faq_accordion':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          accordionItems: [
            { id: 'faq1', question: 'Why did someone send me this link?', answer: 'Someone who knows you recognized that you might be going through a tough time and wanted to provide a confidential, safe place with helpful resources.' },
            { id: 'faq2', question: 'Does anyone track that I visited this page?', answer: 'No. This platform operates on a strict zero-retention policy. Your visit is completely anonymous.' },
            { id: 'faq3', question: 'How do I know if I should see a therapist?', answer: 'If these symptoms have lasted more than a couple of weeks, or if they are interfering with your sleep, work, or relationships, talking with a professional is a great next step.' },
          ],
        },
      };

    case 'resource_links':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          resources: [
            { id: 'r1', title: '988 Suicide & Crisis Lifeline', description: 'Free, confidential 24/7 support via call or text in the US and Canada.', url: 'tel:988', linkType: 'helpline' },
            { id: 'r2', title: 'Crisis Text Line', description: 'Text HOME to 741741 to connect with a crisis counselor 24/7.', url: 'sms:741741', linkType: 'helpline' },
            { id: 'r3', title: 'Psychology Today Therapist Directory', description: 'Find vetted therapists matching your location and insurance.', url: 'https://www.psychologytoday.com', linkType: 'website' },
          ],
        },
      };

    case 'crisis_banner':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          crisis: {
            title: 'Are You in Immediate Crisis?',
            description: 'If you or someone you know is struggling or in crisis, help is available right now. You do not have to navigate this alone.',
            emergencyNumber: '988',
            resources: [
              { id: 'c-988', title: 'Call or Text 988', description: 'Free 24/7 Suicide & Crisis Lifeline', url: 'tel:988', linkType: 'helpline' },
              { id: 'c-741', title: 'Text HOME to 741741', description: 'Connect with Crisis Text Line', url: 'sms:741741', linkType: 'helpline' },
            ],
          },
        },
      };

    case 'cta_banner':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          cta: {
            title: 'Take One Small Step Today',
            description: 'You do not have to solve everything all at once. Bookmark this page or try a single breathing exercise.',
            buttonText: 'Find Professional Support',
            buttonLink: 'https://findtreatment.gov',
          },
        },
      };

    case 'video':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          video: {
            title: 'Guided 3-Minute Reset',
            description: 'A soothing clinical demonstration on calming an overstimulated nervous system.',
            videoUrl: 'https://www.youtube-nocookie.com/embed/inpok4MKVLM',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&auto=format&fit=crop&q=80',
          },
        },
      };

    case 'disclaimer':
      return {
        id,
        blockType,
        order,
        layoutStyle: defaultLayout,
        content: {
          disclaimer: {
            text: 'Medical Disclaimer: This website and resource packet are provided strictly for educational and informational purposes and do not constitute medical, psychiatric, or legal advice. If you are facing a medical emergency, please call 911 or go to the nearest emergency room.',
          },
        },
      };

    default:
      return {
        id,
        blockType,
        order,
        layoutStyle: 'default',
        content: {},
      };
  }
}

export const initialTopics: TopicAndResource[] = [
  {
    id: 'tp-anxiety',
    topicTitle: 'Anxiety',
    resourceTitle: 'Understanding & Navigating Anxiety: A Gentle Guide',
    tone: 'sky',
    icon: 'Wind',
    shortDescription: 'For the person whose mind will not slow down and whose body is holding tension.',
    featuredImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    isPublished: true,
    demand: 3860,
    updatedAt: '2026-08-21T14:20:00Z',
    createdAt: '2026-05-10T10:00:00Z',
    safety: {
      hasCrisisInformation: true,
      crisisResources: [
        { id: 'cr-1', title: '988 Lifeline', description: 'Free 24/7 Call/Text', url: 'tel:988', linkType: 'helpline' },
        { id: 'cr-2', title: 'Crisis Text Line', description: 'Text HOME to 741741', url: 'sms:741741', linkType: 'helpline' },
      ],
      disclaimer: 'This resource is educational and is not medical advice. If in immediate danger, call 988.',
    },
    review: {
      reviewedBy: 'Dr. Sarah Jenkins, PsyD',
      reviewedAt: '2026-08-15T09:30:00Z',
      reviewStatus: 'approved',
    },
    seo: {
      metaTitle: 'Anxiety Support & Coping Guide | Mental Health Support',
      metaDescription: 'A gentle, confidential resource packet for managing anxiety symptoms, physical tension, and panic.',
      keywords: ['anxiety', 'panic relief', 'mental health', 'grounding exercises', 'coping strategies'],
      ogImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('interactive_grounding_tool', 2),
      createDefaultBlock('symptoms_grid', 3),
      createDefaultBlock('myths_vs_facts', 4),
      createDefaultBlock('quote_callout', 5),
      createDefaultBlock('coping_strategies', 6),
      createDefaultBlock('rich_text_jodit', 7),
      createDefaultBlock('faq_accordion', 8),
      createDefaultBlock('crisis_banner', 9),
      createDefaultBlock('disclaimer', 10),
    ],
    // Backward compat fields
    title: 'Anxiety',
    subtitle: 'For the person whose mind will not slow down',
    packetTitle: 'Understanding Anxiety: A Starting Point',
    intro: 'A gentle introduction to what anxiety actually is, written for someone who has never been given language for it.',
    rationale: 'Naming the physical mechanics of anxiety reduces the fear of the symptoms themselves.',
    article: '<h2>You are not overreacting</h2><p>Anxiety is a protective system firing without immediate physical danger.</p>',
    items: [
      { id: 'pi-1', label: 'What anxiety is and what it is not' },
      { id: 'pi-2', label: 'How the body creates physical symptoms' },
      { id: 'pi-3', label: 'Grounding techniques to try today' },
      { id: 'pi-4', label: 'When worry becomes something to talk about' },
      { id: 'pi-5', label: 'How to ask for help without over-explaining' },
    ],
  },
  {
    id: 'tp-depression',
    topicTitle: 'Depression',
    resourceTitle: 'Depression: You Are Not Broken & You Are Not Alone',
    tone: 'lavender',
    icon: 'CloudRain',
    shortDescription: 'For the person who has gone quiet and feels like ordinary life costs too much energy.',
    featuredImage: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    isPublished: true,
    demand: 3210,
    updatedAt: '2026-08-19T09:05:00Z',
    createdAt: '2026-05-12T11:00:00Z',
    safety: {
      hasCrisisInformation: true,
      crisisResources: [
        { id: 'cr-3', title: '988 Lifeline', description: 'Free 24/7 Crisis Call & Text', url: 'tel:988', linkType: 'helpline' },
      ],
      disclaimer: 'Educational resource. Please reach out to licensed mental health professionals for ongoing care.',
    },
    review: {
      reviewedBy: 'Dr. Marcus Vance, MD',
      reviewedAt: '2026-08-18T14:00:00Z',
      reviewStatus: 'approved',
    },
    seo: {
      metaTitle: 'Depression Support & Recovery Pathways',
      metaDescription: 'Empathetic guidance, small viable daily steps, and clinical options for depression.',
      keywords: ['depression', 'mental fatigue', 'therapy options', 'healing from depression'],
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('symptoms_grid', 2),
      createDefaultBlock('warning_signs', 3),
      createDefaultBlock('coping_strategies', 4),
      createDefaultBlock('treatment_options', 5),
      createDefaultBlock('myths_vs_facts', 6),
      createDefaultBlock('faq_accordion', 7),
      createDefaultBlock('crisis_banner', 8),
      createDefaultBlock('disclaimer', 9),
    ],
    title: 'Depression',
    subtitle: 'For the person who has gone quiet',
    packetTitle: 'Depression: You Are Not Broken',
    intro: 'An honest, non-judgmental look at depression that avoids toxic positivity.',
    rationale: 'Readers in a depressive episode have limited energy; leading with the smallest viable action.',
    article: '<h2>Depression is not sadness</h2><p>The most useful way to think about depression is energy debt.</p>',
    items: [
      { id: 'pi-6', label: 'Why depression is not sadness' },
      { id: 'pi-7', label: 'The energy debt nobody warns you about' },
      { id: 'pi-8', label: 'One small thing that helps today' },
      { id: 'pi-9', label: 'How to talk to someone you trust' },
      { id: 'pi-10', label: 'What therapy actually looks like' },
    ],
  },
  {
    id: 'tp-burnout',
    topicTitle: 'Stress & Burnout',
    resourceTitle: 'Navigating Burnout & Restoring Your Inner Energy',
    tone: 'sand',
    icon: 'Flame',
    shortDescription: 'For the person running on empty who cannot seem to refill their tank.',
    featuredImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    isPublished: true,
    demand: 2740,
    updatedAt: '2026-08-23T16:42:00Z',
    createdAt: '2026-05-15T15:00:00Z',
    safety: {
      hasCrisisInformation: false,
      disclaimer: 'Educational material only. Consult medical providers for chronic fatigue evaluations.',
    },
    review: {
      reviewedBy: 'Elena Rostova, LCSW',
      reviewedAt: '2026-08-20T11:00:00Z',
      reviewStatus: 'approved',
    },
    seo: {
      metaTitle: 'Burnout Recovery & Stress Management Guide',
      metaDescription: 'Understand the three stages of burnout, boundary setting, and genuine restorative rest.',
      keywords: ['burnout', 'stress management', 'boundaries', 'workplace wellness'],
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('interactive_grounding_tool', 2),
      createDefaultBlock('info_cards', 3),
      createDefaultBlock('quote_callout', 4),
      createDefaultBlock('coping_strategies', 5),
      createDefaultBlock('faq_accordion', 6),
      createDefaultBlock('disclaimer', 7),
    ],
    title: 'Stress & Burnout',
    subtitle: 'For the person running on empty',
    packetTitle: 'Burnout: Reading the Warning Lights',
    intro: 'Burnout is not a character flaw. This packet separates ordinary stress from exhaustion.',
    rationale: 'Distinguishing stress from burnout gives permission to change something.',
    article: '<h2>Stress and burnout are not the same thing</h2><p>Burnout is disengagement when rest no longer refills you.</p>',
    items: [
      { id: 'pi-11', label: 'Stress versus burnout: the difference' },
      { id: 'pi-12', label: 'The three stages of burnout' },
      { id: 'pi-13', label: 'Boundaries that do not cost you your job' },
      { id: 'pi-14', label: 'Rest that actually restores' },
      { id: 'pi-15', label: 'When to involve a professional' },
    ],
  },
  {
    id: 'tp-grief',
    topicTitle: 'Grief & Loss',
    resourceTitle: 'Grief: Moving Through the Waves on Your Own Timeline',
    tone: 'blush',
    icon: 'HeartHandshake',
    shortDescription: 'For the person carrying something heavy who needs space to mourn without pressure.',
    featuredImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    isPublished: true,
    demand: 1980,
    updatedAt: '2026-08-12T11:15:00Z',
    createdAt: '2026-05-18T12:00:00Z',
    safety: {
      hasCrisisInformation: true,
      crisisResources: [
        { id: 'cr-4', title: '988 Lifeline', description: 'Crisis support 24/7', url: 'tel:988', linkType: 'helpline' },
      ],
      disclaimer: 'Prolonged grief that prevents daily functioning warrants compassionate professional care.',
    },
    review: {
      reviewedBy: 'Dr. Sarah Jenkins, PsyD',
      reviewedAt: '2026-08-10T10:00:00Z',
      reviewStatus: 'approved',
    },
    seo: {
      metaTitle: 'Grief & Loss Support Guide',
      metaDescription: 'Why the five stages are a myth, understanding grief waves, and caring for yourself in loss.',
      keywords: ['grief', 'loss', 'mourning', 'bereavement support'],
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('quote_callout', 2),
      createDefaultBlock('symptoms_grid', 3),
      createDefaultBlock('supporting_someone', 4),
      createDefaultBlock('resource_links', 5),
      createDefaultBlock('disclaimer', 6),
    ],
    title: 'Grief & Loss',
    subtitle: 'For the person carrying something heavy',
    packetTitle: 'Grief: There Is No Correct Timeline',
    intro: 'There is no schedule for grief. This packet replaces the five-stages myth.',
    rationale: 'Grieving readers most often need validation that their timeline is normal.',
    article: '<h2>The five stages were never a schedule</h2><p>Grief arrives in waves, and the gaps slowly get longer.</p>',
    items: [
      { id: 'pi-16', label: 'Why the five stages are a myth' },
      { id: 'pi-17', label: 'Grief waves and what triggers them' },
      { id: 'pi-18', label: 'Caring for your body while mourning' },
      { id: 'pi-19', label: 'Anniversaries and how to prepare' },
      { id: 'pi-20', label: 'Support groups worth knowing about' },
    ],
  },
  {
    id: 'tp-substance',
    topicTitle: 'Substance Use',
    resourceTitle: 'Substance Use: A Door to Support, Not a Verdict',
    tone: 'mist',
    icon: 'Anchor',
    shortDescription: 'A shame-free, harm-reduction approach to evaluating your relationship with substances.',
    featuredImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
    status: 'published',
    isPublished: true,
    demand: 1290,
    updatedAt: '2026-08-09T08:50:00Z',
    createdAt: '2026-05-20T08:00:00Z',
    safety: {
      hasCrisisInformation: true,
      crisisResources: [
        { id: 'cr-5', title: 'SAMHSA National Helpline', description: '1-800-662-4357 (Free 24/7)', url: 'tel:18006624357', linkType: 'helpline' },
        { id: 'cr-6', title: 'Never Use Alone', description: '1-800-484-3731 (Overdose prevention)', url: 'tel:18004843731', linkType: 'helpline' },
      ],
      disclaimer: 'Abrupt cessation of certain substances can be medically hazardous. Seek medical consultation.',
    },
    review: {
      reviewedBy: 'Dr. Marcus Vance, MD',
      reviewedAt: '2026-08-05T09:00:00Z',
      reviewStatus: 'approved',
    },
    seo: {
      metaTitle: 'Substance Use & Harm Reduction Resources',
      metaDescription: 'Confidential, shame-free guidance, harm reduction guidelines, and treatment directories.',
      keywords: ['substance use', 'harm reduction', 'recovery', 'SAMHSA helpline'],
    },
    sections: [
      createDefaultBlock('hero_section', 0),
      createDefaultBlock('intro_section', 1),
      createDefaultBlock('info_cards', 2),
      createDefaultBlock('treatment_options', 3),
      createDefaultBlock('resource_links', 4),
      createDefaultBlock('crisis_banner', 5),
      createDefaultBlock('disclaimer', 6),
    ],
    title: 'Substance Use',
    subtitle: 'For the person who is starting to wonder',
    packetTitle: 'Substance Use: A Door, Not a Verdict',
    intro: 'A shame-free framing of substance use, harm reduction, and the many doors into support.',
    rationale: 'Confrontation drives readers away; harm-reduction language keeps doors open.',
    article: '<h2>This is not an intervention</h2><p>The only useful question is: is this costing me more than it gives?</p>',
    items: [
      { id: 'pi-21', label: 'Use, misuse, and dependence' },
      { id: 'pi-22', label: 'Harm reduction basics' },
      { id: 'pi-23', label: 'What withdrawal can look like' },
      { id: 'pi-24', label: 'Meetings, outpatient, and inpatient options' },
      { id: 'pi-25', label: 'Supporting someone without enabling' },
    ],
  },
];