# ADYA VIGIL AI — Design Direction

## Three initial directions

### Theme Name: Signal & Safety
Very Brief Intro: An editorial security console that combines calm paper-like surfaces with sharp, high-visibility safety signals. It should feel analytical, human, and trustworthy rather than intimidating.
Probability: 0.07

### Theme Name: Midnight Threat Lab
Very Brief Intro: A dark forensic workspace with restrained amber alerts, dense telemetry, and a cinematic incident-response mood. It prioritizes urgency and technical confidence.
Probability: 0.03

### Theme Name: Soft Shield Utility
Very Brief Intro: A lighter, approachable consumer-safety app with rounded utility cards, muted blue-gray surfaces, and friendly guidance. It makes phishing education feel less alarming.
Probability: 0.08

## Chosen approach: Signal & Safety

### Design Movement
Contemporary editorial systems design: Swiss-influenced information hierarchy, airport signage legibility, and incident-response console precision.

### Core Principles
1. **Calm first, alert second.** The base interface is warm, quiet, and readable; danger appears as a deliberate signal, never as ambient noise.
2. **Evidence over decoration.** Every score, label, and recommendation is tied to visible reasoning and specific indicators.
3. **Asymmetric command center.** Use a persistent rail, split panes, and offset cards instead of one centered marketing column.
4. **Human-readable security.** Translate detection logic into plain language, with clear next actions and no fear-mongering.

### Color Philosophy
Use an ink-navy foundation for trust and legibility, a warm mineral background for calm, and one ownable safety color—**signal citron**—for actions, active states, and high-contrast emphasis. Threat levels use a restrained traffic system: citron for low, amber for caution, and brick-red for high. Color should explain state, not decorate it.

### Layout Paradigm
A persistent left navigation rail anchors the product. The main workspace uses a wide asymmetric scan surface: the input panel takes the primary left field while a live "signal board" on the right explains what the engine is checking. Dashboard views use a staggered evidence layout with a large current posture card, compact stat tiles, and a narrow activity list.

### Signature Elements
- A thin vertical **signal line** that animates beside scan status and result sections.
- Offset paper panels with hard-edged corner notches rather than uniform rounded cards.
- Monospaced micro-labels for evidence, confidence, detection type, and timestamps.

### Interaction Philosophy
Every action should confirm intent and provide context. Scan actions feel like submitting evidence to a careful analyst, not pressing a magic button. Inputs retain their content, results can be reviewed, and recent scans remain visible. Empty states should teach the user what to submit next.

### Animation
Use 160–220ms ease-out transitions for navigation, tabs, chips, and button press feedback. On scan, animate the signal line through three brief evidence stages—normalize, inspect, classify—before revealing the score. Reveal evidence rows with 40ms stagger. Respect reduced-motion preferences by keeping all result transitions instant.

### Typography System
Display: **Space Grotesk** 600–700 for product headers and major scores. Body: **DM Sans** 400–600 for readable explanations and controls. Utility: **IBM Plex Mono** 500 for detection tags, timestamps, and score metadata. Headings should be sentence case with compact tracking; utility labels use uppercase with generous letter spacing.

### Brand Essence
ADYA VIGIL AI is a browser-based phishing signal desk for people who need a quick, explainable answer before they click, reply, scan, or pay. Personality: **watchful, lucid, grounded**.

### Brand Voice
Headlines are direct and reassuring. CTAs describe the action, not the hype. Microcopy states what the model found and what the user can do now.

Example lines:
- “Check the signal before you follow it.”
- “A suspicious sender is not proof of harm. Here is the evidence we found.”

### Wordmark & Logo
The mark is a compact angular eye-shield: two offset chevrons create a watchful aperture inside a squared shield, with a small citron signal notch on the upper-right edge. The wordmark uses a custom all-caps ADYA lockup with a visibly cut A crossbar and the descriptor VIGIL AI set in monospaced utility text below.

### Signature Brand Color
**Signal Citron — #D8F23F.** It is bright enough to function as a focus signal against ink navy, but unusual enough to own the identity. It represents a clear moment of attention before an irreversible click.

## Style Decisions
- Keep the interface light and editorial, with ink navy as the strongest contrast color.
- Use generated visual assets only for the brand mark and one supporting hero visual; the product UI itself remains evidence-led and information dense.
- Avoid purple gradients, generic rounded dashboards, and ungrounded security fear language.
- Make every risk result include a score, a plain-language verdict, visible reasons, and concrete next steps.
