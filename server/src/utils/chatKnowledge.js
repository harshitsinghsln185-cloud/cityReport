/**
 * Real project facts knowledge base for Crowd Report Civic Platform.
 * Grounded strictly in platform capabilities, settings, and business logic.
 */

export const PLATFORM_FACTS = {
  about: `**Crowd Report** is a modern civic issue resolution platform connecting citizens with certified municipal contractors and resolvers. Citizens can report public infrastructure hazards (potholes, water leaks, broken streetlights, uncollected waste) with GPS coordinates and photos. Resolvers inspect the site, provide an upfront quote, and complete repairs with verified before-and-after photo proof.`,

  paymentModel: `Crowd Report operates on a **50% Advance & 50% Balance Milestone Model**:
1. **50% Advance**: Paid upon quote approval to mobilize certified resolvers and procure repair materials.
2. **Escrow Protection**: Funds remain securely protected until work is finished.
3. **50% Balance**: Released only after the resolver uploads verified before/after proof and the resolution is confirmed.`,

  fees: `Civic resolution fees depend on the service category and on-site inspection:
• **Base Fees**: Start from ₹300 (e.g., Garbage: ₹300, Streetlights: ₹350, Water Supply: ₹400, Drainage: ₹500, Road Damage: ₹600).
• **Milestone Quote**: A certified resolver conducts an on-site assessment to determine exact material & labor costs.
• **Escrow Guarantee**: No hidden surcharges; all costs are disclosed before advance payment.`,

  resolvers: `**Resolvers** are certified local contractors, licensed technicians, and municipal service specialists. Every resolver undergoes:
• Identity, business, and GST verification
• Trade credential and insurance checks
• Ongoing performance, turnaround time, and citizen satisfaction ratings.`,

  tracking: `You can track any civic issue using its unique **Issue Code** (e.g., \`CR-2026-XXXX\`):
• Go to the **Track Status** page at \`/track\` to view live progress without logging in.
• Registered citizens can also track all their reported issues under **Citizen Dashboard > My Issues**.
• Stages: *Submitted → Inspection Scheduled → Quote Approved → Work In Progress → Resolved & Verified*.`,

  states: `Crowd Report provides **Pan-India Coverage across all 36 States and Union Territories**, including Delhi NCT, Maharashtra, Karnataka, Tamil Nadu, Uttar Pradesh, Kerala, Gujarat, West Bengal, Punjab, and all North Eastern states. You can explore regional coverage in our **States Directory**.`,

  inspection: `**Yes, an on-site inspection occurs before repair work begins.** A certified municipal resolver visits the reported coordinates to verify the hazard, calculate exact material requirements, and generate an itemized quote with turnaround time estimates.`,

  cancellation: `You can cancel a reported issue at any time **before the on-site inspection or quote confirmation** with zero penalty. If advance payment has already been made into escrow, cancellation is subject to resolver mobilization terms, with unutilized funds promptly refunded.`,

  safety: `**Your personal data is strictly protected.** We redact phone numbers, emails, and personal identification from public issue records. Resolvers only receive civic site coordinates and job descriptions. All transactions are encrypted and secured via enterprise payment gateways.`,

  process: `Here is what happens when you report an issue on Crowd Report:
1. **Submit**: Report the issue with category, GPS location, and photos.
2. **Inspection**: A certified resolver inspects the site and issues an itemized quote.
3. **50% Advance**: You approve the quote and deposit the 50% advance into escrow.
4. **Resolution**: The resolver completes the work and uploads time-stamped proof.
5. **50% Balance**: You verify completion and release the final payment.`,
};

export const KNOWLEDGE_TOPICS = [
  {
    topic: 'about',
    patterns: [
      /what is crowd report/i,
      /about crowd report/i,
      /what does this platform do/i,
      /how does crowd report work/i,
      /who are you/i,
      /what is this website/i,
    ],
    answer: PLATFORM_FACTS.about,
    quickReplies: ['Report an Issue', 'View Categories', 'How Payment Works'],
  },
  {
    topic: 'payment',
    patterns: [
      /how does payment work/i,
      /50% advance/i,
      /advance payment/i,
      /milestone payment/i,
      /balance payment/i,
      /escrow/i,
      /when do i pay/i,
      /payment model/i,
    ],
    answer: PLATFORM_FACTS.paymentModel,
    quickReplies: ['View Categories', 'Fee Structure', 'Report an Issue'],
  },
  {
    topic: 'fees',
    patterns: [
      /how much does .* cost/i,
      /pothole repair cost/i,
      /what is the fee/i,
      /fee structure/i,
      /service charges/i,
      /base fee/i,
      /pricing/i,
      /how expensive/i,
    ],
    answer: PLATFORM_FACTS.fees,
    quickReplies: ['View Categories', 'How Payment Works', 'Report an Issue'],
  },
  {
    topic: 'resolvers',
    patterns: [
      /who are resolvers/i,
      /how are contractors verified/i,
      /contractor verification/i,
      /certified resolvers/i,
      /who fixes the issue/i,
      /who does the work/i,
    ],
    answer: PLATFORM_FACTS.resolvers,
    quickReplies: ['View Categories', 'Report an Issue', 'Safety & Privacy'],
  },
  {
    topic: 'tracking',
    patterns: [
      /how do i track/i,
      /track my issue/i,
      /track status/i,
      /issue code/i,
      /tracking code/i,
      /where is my report/i,
    ],
    answer: PLATFORM_FACTS.tracking,
    quickReplies: ['Track Status', 'View Categories', 'Report an Issue'],
  },
  {
    topic: 'states',
    patterns: [
      /supported states/i,
      /do you (?:work|operate|cover) in/i,
      /available in (?:delhi|kerala|mumbai|bangalore|india|[a-z]+)/i,
      /service areas/i,
      /pan-india/i,
      /state coverage/i,
      /what states/i,
      /which states/i,
    ],
    answer: PLATFORM_FACTS.states,
    quickReplies: ['View States Directory', 'Report an Issue', 'View Categories'],
  },
  {
    topic: 'inspection',
    patterns: [
      /inspection before work/i,
      /is there an inspection/i,
      /on-site inspection/i,
      /physical inspection/i,
      /who visits the site/i,
    ],
    answer: PLATFORM_FACTS.inspection,
    quickReplies: ['How Payment Works', 'Report an Issue', 'View Categories'],
  },
  {
    topic: 'cancellation',
    patterns: [
      /can i cancel/i,
      /cancel my issue/i,
      /cancellation policy/i,
      /refund policy/i,
    ],
    answer: PLATFORM_FACTS.cancellation,
    quickReplies: ['How Payment Works', 'Track Status', 'Report an Issue'],
  },
  {
    topic: 'safety',
    patterns: [
      /is my data safe/i,
      /privacy/i,
      /pii/i,
      /data protection/i,
      /who can see my phone/i,
    ],
    answer: PLATFORM_FACTS.safety,
    quickReplies: ['About Platform', 'Report an Issue', 'View Categories'],
  },
  {
    topic: 'process',
    patterns: [
      /what happens after i report/i,
      /resolution process/i,
      /steps to resolve/i,
      /workflow/i,
    ],
    answer: PLATFORM_FACTS.process,
    quickReplies: ['How Payment Works', 'Report an Issue', 'View Categories'],
  },
];

/**
 * Matches a query against grounded platform knowledge.
 *
 * @param {string} text
 * @returns {{ matched: boolean, answer?: string, quickReplies?: string[] }}
 */
export const matchWebsiteKnowledge = (text = '') => {
  const clean = text.trim();
  if (!clean) return { matched: false };

  for (const item of KNOWLEDGE_TOPICS) {
    for (const pattern of item.patterns) {
      if (pattern.test(clean)) {
        return {
          matched: true,
          topic: item.topic,
          answer: item.answer,
          quickReplies: item.quickReplies,
        };
      }
    }
  }

  return { matched: false };
};

export default {
  PLATFORM_FACTS,
  KNOWLEDGE_TOPICS,
  matchWebsiteKnowledge,
};
