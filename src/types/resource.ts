import type { ToneKey, PublishStatus } from './index';

export type ResourceCategory = string;

export type ResourceBlockType =
  | 'hero_section'
  | 'intro_section'
  | 'rich_text_jodit'
  | 'symptoms_grid'
  | 'warning_signs'
  | 'info_cards'
  | 'image_text'
  | 'quote_callout'
  | 'coping_strategies'
  | 'interactive_grounding_tool'
  | 'myths_vs_facts'
  | 'treatment_options'
  | 'supporting_someone'
  | 'faq_accordion'
  | 'resource_links'
  | 'crisis_banner'
  | 'cta_banner'
  | 'video'
  | 'disclaimer';

export type ResourceLayoutStyle =
  | 'default'
  | 'full_width'
  | 'container_centered'
  | 'two_column_split'
  | 'grid_2_col'
  | 'grid_3_col'
  | 'grid_4_col'
  | 'card_grid'
  | 'accent_bg';

export interface IResourceHeroContent {
  headline: string;
  subheadline?: string;
  bgImage?: string;
}

export interface IIntroContent {
  title: string;
  description: string;
}

export interface IFeatureItem {
  id?: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface ISymptomItem {
  id?: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface IWarningSignItem {
  id?: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface IImageTextContent {
  title?: string;
  description: string;
  imageUrl: string;
  imagePosition?: 'left' | 'right';
}

export interface IQuoteContent {
  text: string;
  author?: string;
}

export interface ICopingStrategy {
  id?: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface IGroundingContent {
  title: string;
  description?: string;
  technique?: '4-7-8' | 'box_4_4_4_4' | 'calm_4_6';
  guidanceText?: string;
}

export interface IMythFactItem {
  id?: string;
  myth: string;
  fact: string;
}

export interface IMythsFactsContent {
  title: string;
  description?: string;
  items: IMythFactItem[];
}

export interface ITreatmentOption {
  id?: string;
  title: string;
  description?: string;
  iconUrl?: string;
}

export interface ISupportingSomeoneContent {
  title: string;
  description: string;
  tips?: IFeatureItem[];
}

export interface IAccordionItem {
  id?: string;
  question: string;
  answer: string;
}

export interface IResourceLink {
  id?: string;
  title: string;
  description?: string;
  url: string;
  linkType?: 'website' | 'helpline' | 'organization' | 'article' | 'video';
}

export interface ICrisisContent {
  title: string;
  description: string;
  emergencyNumber?: string;
  resources?: IResourceLink[];
}

export interface ICtaContent {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface IVideoContent {
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
}

export interface IDisclaimerContent {
  text: string;
}

export interface IBlockContent {
  hero?: IResourceHeroContent;
  intro?: IIntroContent;
  richTextHtml?: string;
  symptoms?: ISymptomItem[];
  warningSigns?: IWarningSignItem[];
  features?: IFeatureItem[];
  imageText?: IImageTextContent;
  quote?: IQuoteContent;
  copingStrategies?: ICopingStrategy[];
  groundingTool?: IGroundingContent;
  mythsFacts?: IMythsFactsContent;
  treatmentOptions?: ITreatmentOption[];
  supportingSomeone?: ISupportingSomeoneContent;
  accordionItems?: IAccordionItem[];
  resources?: IResourceLink[];
  crisis?: ICrisisContent;
  cta?: ICtaContent;
  video?: IVideoContent;
  disclaimer?: IDisclaimerContent;
}

export interface IResourceBlock {
  _id?: string;
  id?: string;
  blockType: ResourceBlockType;
  order?: number;
  layoutStyle?: ResourceLayoutStyle;
  content: IBlockContent;
}

export interface IResourceSafety {
  hasCrisisInformation: boolean;
  crisisResources?: IResourceLink[];
  disclaimer: string;
}

export interface IResourceReview {
  reviewedBy?: string;
  reviewedAt?: Date | string;
  reviewStatus?: 'pending' | 'approved' | 'rejected';
}

export interface IResourceSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface IResource {
  _id?: string;
  id: string;
  topicTitle: string;
  resourceTitle: string;
  slug?: string;
  tone: ToneKey;
  icon?: string;
  category?: string;
  shortDescription?: string;
  featuredImage: string;
  sections?: IResourceBlock[];
  safety: IResourceSafety;
  review?: IResourceReview;
  isPublished?: boolean;
  seo?: IResourceSeo;
  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Backward compatibility fields with previous Topic interface
  title?: string;
  subtitle?: string;
  intro?: string;
  rationale?: string;
  packetTitle?: string;
  article?: string;
  items?: { id: string; label: string }[];
  status?: PublishStatus;
  demand?: number;
}

export type TopicAndResource = IResource;
