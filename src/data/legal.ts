import type { Hotline, LegalDoc } from '../types';

export const initialLegalDocs: LegalDoc[] = [
{
  id: 'privacy',
  label: 'Privacy Policy',
  description: 'Rendered on the mobile Privacy screen. Governs our zero-retention claim.',
  updatedAt: '2026-08-22T09:00:00Z',
  html: `<h2>Zero Retention, By Design</h2><p>Mental Health Anonymous does not store the phone number or email address of anyone you send a packet to. Contact details are held in volatile memory only for the seconds required to hand your packet to our delivery gateway, and the buffer is purged immediately afterward.</p><h3>What we never collect</h3><ul><li>Sender identity, device identifiers, or IP-linked profiles</li><li>Recipient contact details after dispatch completes</li><li>Message history, read receipts, or reply threads</li></ul><h3>What we do count</h3><p>We keep anonymous aggregate counters — how many packets were sent for each topic, and whether delivery succeeded. These counters contain no contact information and cannot be traced back to a person.</p><p><strong>If we were compelled to produce records of who sent what to whom, we would have nothing to produce.</strong></p><h3>Third parties</h3><p>Delivery is carried out by Twilio (SMS) and SendGrid (email). They process the destination address transiently to complete delivery under contractual instructions not to retain it for their own purposes.</p>`
},
{
  id: 'terms',
  label: 'Terms & Conditions',
  description: 'Acceptable use, educational disclaimer, and abuse policy.',
  updatedAt: '2026-08-14T15:30:00Z',
  html: `<h2>Terms of Use</h2><p>By using Mental Health Anonymous you agree to send packets only to people you genuinely believe may benefit from them. This service exists to open a door, never to pressure, shame, or harass.</p><h3>Educational purpose only</h3><p>Every packet and article is an educational resource. Nothing in this app is medical advice, diagnosis, or treatment, and no packet substitutes for care from a licensed clinician.</p><h3>Prohibited use</h3><ul><li>Repeated sends to a recipient who has asked you to stop</li><li>Using packets to mock, accuse, or intimidate</li><li>Automated or bulk dispatch of any kind</li></ul><h3>Rate limits and suppression</h3><p>Destinations involved in reported misuse may be rate-limited or suppressed without notice. Because we retain no delivery records, suppression is applied at the destination level rather than to an individual sender.</p><h3>Changes to these terms</h3><p>Material changes are announced in-app before they take effect. Continued use after that point constitutes acceptance.</p>`
},
{
  id: 'faq',
  label: 'FAQ',
  description: 'The questions people ask before they trust the app enough to send.',
  updatedAt: '2026-08-25T06:00:00Z',
  html: `<h2>Frequently Asked Questions</h2><h3>Will the person know it came from me?</h3><p>No. Your name, number, and email never appear in the message or its headers. The packet arrives from our shared delivery address with no sender reference of any kind.</p><h3>Can I take it back after sending?</h3><p>No. Delivery is immediate and we keep no record of it, so there is nothing to recall. Read the packet yourself before you send it.</p><h3>Can they reply to me?</h3><p>Not through us. The packet is one-directional by design, so nobody can be traced backward through a reply.</p><h3>Is this free?</h3><p>Yes. Sending a packet is free and always will be. We are funded by donations and grants, never by advertising or data.</p><h3>Who writes the articles?</h3><p>Our editorial team drafts every article and a licensed clinician reviews it before publication. Articles are reviewed again at least twice a year.</p><h3>What if someone is in danger right now?</h3><p>Do not send a packet — call or text 988 in the US, or your local emergency number. Educational reading is not a crisis response.</p><h3>Can I send to someone outside the US?</h3><p>Email works worldwide. SMS is currently US and Canada only, and the crisis numbers in our articles are US-based.</p>`
}];


export const initialHotlines: Hotline[] = [
{
  id: 'hl-988',
  name: 'Suicide & Crisis Lifeline',
  number: '988',
  description: 'National three-digit line for any mental health crisis.',
  availability: '24/7 · call or text'
},
{
  id: 'hl-text',
  name: 'Crisis Text Line',
  number: '741741',
  description: 'Text HOME to reach a trained crisis counselor.',
  availability: '24/7 · SMS only'
},
{
  id: 'hl-samhsa',
  name: 'SAMHSA National Helpline',
  number: '1-800-662-4357',
  description: 'Treatment referral and information for substance use.',
  availability: '24/7 · English & Spanish'
},
{
  id: 'hl-trevor',
  name: 'The Trevor Project',
  number: '1-866-488-7386',
  description: 'Crisis support for LGBTQ+ young people.',
  availability: '24/7 · call, text, chat'
}];