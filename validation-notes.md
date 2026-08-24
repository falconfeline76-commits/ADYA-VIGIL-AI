# Validation notes

On 2026-08-24, the restarted full-stack preview rendered successfully at `/scan`, `/history`, and `/`. The scan center displayed the ADYA VIGIL AI sidebar, four input types, the URL textarea, local-model messaging, and generated supporting visual assets.

A representative URL, `http://secure-login.example.top/verify?account=payment&token=%2F%2F`, was analyzed in the browser. The app returned a score of 58/100 with the verdict `Needs caution`, plus findings for an unencrypted destination (+22), a higher-risk link pattern (+18), and a credential or payment lure (+18). The UI showed three concrete next steps and a success toast confirming `Scan saved to history`.

The history page then showed `1 SAVED RECORDS` with the submitted URL sample, score 58, verdict, and local timestamp. The dashboard then showed average risk 58, total scans 1, high risk 0, caution 1, and the latest scan activity row. This confirms the tRPC procedure, database persistence, query invalidation, and dashboard aggregation are connected in the running app.

The QR upload flow is implemented for image/png, image/jpeg, image/webp, and image/gif files up to 5 MB. Uploaded bytes are sent to the server, stored using the platform storage helper, and the returned storage key/url plus metadata are persisted in `storedFiles`. Browser QR decoding is attempted via `BarcodeDetector` when available; otherwise the stored image remains available for contextual analysis.

The refreshed scan center also passed a QR-mode check: selecting QR image reveals the upload affordance with the supported image types and 5 MB limit, plus the decoded payload/context input. A mobile breakpoint check remains to be captured before final checkpoint.

The end-to-end QR upload test succeeded after making the file input targetable. The browser accepted `/home/ubuntu/webdev-static-assets/adya-vigil-hero.png` through the QR image flow, and the UI showed the upload in progress. The frontend now retains the returned file ID, creates the scan, and calls `files.linkToScan` with the new scan ID before invalidating file/scan queries.

A complete linked QR test was then run in one browser session. The PNG upload succeeded, the decoded payload field was filled with `https://secure-wallet.example.top/verify?payment=required`, and the scan returned `42/100 · Needs caution` with sensitive-data and action-request findings. The UI confirmed `Scan saved to history`. The upload path now calls `files.linkToScan` after scan creation, so the uploaded file's stored-file row receives the saved scan ID.

Mobile validation at 390×844 was captured for `/`, `/scan`, `/history`, and `/about`. The sidebar becomes a compact horizontal nav, cards stack cleanly, the scan form remains usable, and the history/about content stays readable without horizontal overflow. The dashboard reflects the new QR scan with total scans 2, average risk 50, caution 2, and the QR sample at score 42.

Tablet validation at 768×1024 was captured for `/`, `/scan`, `/history`, and `/about`. The persistent sidebar stays readable, dashboard metrics use a two-column arrangement, the scan panel and visual evidence stack appropriately, and history/About content remain within the viewport without horizontal overflow.

The latest database verification returned the newest QR file with `fileId=2`, `scanId=30001`, `linkedScanId=30001`, `inputType=qr`, `score=42`, `verdict=Needs caution`, and storage key `adya-vigil/anonymous/adya-vigil-hero_cc81c060.png`. An earlier standalone upload remains unlinked as an expected artifact from the initial upload-only test.

Vanilla frontend validation: the new falcon mark loads from the generated storage asset, the dashboard shield shows a live signal sweep, the scan page exposes the Demo trace switch, and the Analyze button enters a visible `Scanning signal…` state with a moving scan beam. A test payload containing `javascript:eval(document.cookie)` and a `.top` login URL returned `98/100 · High risk` with explicit `Malicious URL pattern`, `Credential or payment lure`, `Weak JavaScript pattern`, and `Unencrypted destination` findings, followed by the next-step playbook. The input binding was repaired so typing enables the action.

Vanilla-theme mobile screenshots at 390×844 show the dashboard and scan center rendering with the new neon cyber-security system, falcon mark, shield sweep, stacked cards, and usable scan form. The parallel screenshot capture returned blank images for `/history` and `/about`, so those two routes require isolated runtime verification before the final checkpoint.

Isolated route verification resolved the earlier parallel-capture ambiguity: `/history` rendered 4 persisted records with scores 98, 4, 42, and 58, and `/about` rendered the full model explanation plus the falcon panel. The blank mobile images for those routes were capture timing artifacts, not page runtime failures.

The frontend conversion now passes `pnpm check`, `pnpm test`, and `pnpm build`. The new PostgreSQL adapter consumes `ENV.postgresDatabaseUrl` and `ENV.postgresSsl`, remains inactive without a supplied external connection string, and is covered by `server/postgres.test.ts`. The live preview remains operational on the managed database path. Full isolated route checks succeeded for dashboard, scan center, history, and About; the scan test produced a 98/100 High risk result with Malicious URL pattern and Weak JavaScript pattern explanations.

Demo Lab validation: the scan page now displays six clearly labeled simulated examples across URL, SMS, and email. Clicking `Wallet verification lure` automatically selected URL mode, enabled Demo trace, autofilled the payload, and ran the same animated workflow. It returned 66/100 Needs caution with Unencrypted destination, Malicious URL pattern, and Credential or payment lure findings plus three next steps. The page clearly labels the inputs as simulated and does not claim external threat-intelligence verification.

Post-change mobile Demo Lab validation at 390×844 succeeded. The six URL, SMS, and email cards stack into a readable single-column list, preserve their lower-risk/suspicious labels, keep the Load and analyze actions visible, and remain usable above the scanner form without horizontal overflow.

Direct Demo Lab inspection confirmed six cards and six visible `Load and analyze` actions. The captured 390×844 mobile layout shows the cards stacked in one column with labels and actions intact; the live DOM inspection also reported no horizontal overflow at the available viewport.

Reviewed the post-change 390×844 screenshot directly: the Demo Lab cards are stacked in one column, each card shows its type, lower-risk/suspicious label, description, and Load and analyze action, and the layout remains within the viewport without horizontal overflow.

Refined Demo trace validation: enabling Demo trace opens the compact picker beneath the URL/content textarea, with the arrow changing between Show and Hide demo samples. The picker exposes exactly four paste-ready choices—two marked LOW RISK and two marked HIGH RISK—with no explanatory paragraphs on the choices. Selecting the high-risk URL inserted its content into the URL field and kept the live Analyze action available.

Four-sample outcome validation in the live scanner: the high-risk URL returned 98/100 High risk with unencrypted destination, malicious URL pattern, credential/payment lure, and weak JavaScript findings. The low-risk URL returned 4/100 Low signal. The low-risk email returned 9/100 Low signal with only a sender-context verification note. The remaining high-risk email is designed to score high from urgency, sensitive-data request, action request, redirect marker, and sender context.

Completed the fourth demo outcome: the high-risk email sample returned 89/100 High risk with urgency pressure, sensitive-data request, action request, redirect/attachment marker, and sender-context findings. The four live sample outcomes are now confirmed as 98 and 89 High risk, and 4 and 9 Low signal.

Refined picker mobile validation at 390×844 with `?demo=1` succeeded. Demo trace starts enabled, the arrow control shows Hide demo samples, all four cards are visible in a single column with two low-risk and two high-risk labels, each Paste into field action remains visible, and the entire scan panel stays within the viewport without horizontal overflow.

Direct picker interaction checks completed after the mobile capture: selecting the low-risk URL inserted `https://www.example.com/security-center`, selected URL mode, kept Analyze enabled, and reported no horizontal overflow. Selecting the high-risk email inserted the full simulated email content, selected Email mode, kept Analyze enabled, and reported no horizontal overflow. The 390×844 screenshot confirms the same picker is stacked and visible at mobile width.

Final refined picker verification: the reviewed 390×844 screenshot with `?demo=1` shows Demo trace enabled, the Hide demo samples arrow, and four stacked sample cards with both low-risk and high-risk labels. Direct live-page checks confirmed the low-risk URL and high-risk email cards insert their content, select the correct input type, leave Analyze enabled, and do not introduce horizontal overflow.

Demo trace visibility fix validated: `/scan` with Demo trace off renders no sample arrow and no sample cards. Turning the switch on renders the arrow and four sample cards; turning it off removes both immediately. The existing scanner controls remain visible in both states.

How It Works validation: the new `/how-it-works` route is present in navigation, renders the falcon shield sweep, four model stages, signal categories, scoring explanation, and next-step guidance. Scan center no longer includes the former explanatory board and now focuses on the scanner. The mobile screenshots show the How It Works cards stacking cleanly and the simplified Scan center fitting the viewport.

Automatic sample flow validated with the low-risk URL: selecting the sample changed the picker control to `Show demo samples`, displayed `Scanning signal…` immediately, and delivered a `4/100 Low signal` result with reasons and next steps without a second Analyze click.

Automatic sample flow validated with the high-risk URL: selecting the sample immediately collapsed the picker to `Show demo samples`, displayed `Scanning signal…`, and delivered a `98/100 High risk` result with unencrypted destination, malicious URL pattern, credential/payment lure, weak JavaScript pattern, and next-step guidance without a second Analyze click.

Navigation validation: clicking `How it works` from Scan center opened `/how-it-works`; clicking `Scan center` returned to `/scan`. The refreshed bright falcon mark is visible in the sidebar and How It Works shield panel.

Falcon mark validation: the regenerated bright mark is visible and well-defined in the sidebar and inside the animated shield on How It Works. Desktop and 390px mobile captures show strong cyan/lime contrast, a readable silhouette, and clear rendering at both compact and large display sizes.

Direct mobile preview review: `/how-it-works` stacks the hero and model content cleanly at 390px; headings and buttons remain readable, and the bright falcon mark is clear in the sidebar and shield panel. `/scan` fits the input card, type tabs, textarea, and Analyze action within the viewport without horizontal overflow. The mobile capture shows the simplified Scan center with Demo trace off and no demo samples visible.

Dashboard branding validation: desktop and 390px mobile captures show the large `THE FALCON CODERS` masthead centered above the first-page dashboard header, with luminous golden spark accents and a subtle gold rule. The enlarged `VIGIL AI` wordmark remains readable in the sidebar, while the dashboard shield continues to display the bright falcon mark clearly.

Explicit mobile dashboard review: at 390px, `THE FALCON CODERS` is centered and readable with gold spark accents and a gold rule; the enlarged `VIGIL AI` sidebar wordmark remains clear; the shield card begins below the header with no overlap or horizontal overflow.

REPORT action validation: the live `/scan` page renders `Analyze signal` and `REPORT` together in the action row, with the REPORT anchor pointing exactly to `https://cybercrime.gov.in/Webform/Accept.aspx`. The destination opened successfully as the Government of India's National Cyber Crime Reporting Portal and displayed its complaint-filing guidance.

REPORT action responsive validation: desktop `/scan` shows the report action integrated into the Scan Center action row styling, while the 390px mobile layout keeps the input panel within the viewport and preserves the responsive action-group treatment without horizontal overflow. Live DOM inspection confirms the REPORT anchor uses the official cybercrime portal URL.

Score-floor update validation: the heuristic engine now calculates the weighted total first and returns `0` whenever that total is below `10`; totals at or above `10` are unchanged up to the existing 99-point cap. The low-risk URL regression now returns `0/100 · Low signal`, while a suspicious URL remains at or above 10. `node --check client/src/main.js`, `pnpm check`, `pnpm test`, and `pnpm build` all pass; the Vitest suite now covers both the score floor and the existing REPORT-link behavior.

REPORT redirect fix validation: the Scan Center now renders REPORT as a button with an explicit click handler that assigns the portal URL to the top-level window, with a same-window fallback. A live click from `/scan` successfully navigated to `https://cybercrime.gov.in/Webform/Accept.aspx`, which loaded the National Cyber Crime Reporting Portal.

Redirect fix follow-up: the live REPORT button was executed from `/scan` and successfully navigated to the official cybercrime portal. A mobile capture after returning to the app confirms the REPORT button remains part of the responsive Scan Center action group; the initial mobile capture failed while the browser was still on the external portal, then succeeded after reopening `/scan`.

Sidebar refinement desktop review: Dashboard shows `CYBER DEFENSE NETWORK` with `LIVE SIGNAL MONITOR`, plus a luminous calendar icon. Scan center shows the same new sidebar label and a QR-scanning corner icon. The existing masthead, page headers, scanner content, report control, and other navigation items remain unchanged in the reviewed captures.

Sidebar refinement mobile review: at 390px, the new calendar Dashboard icon and QR Scan center icon are compact, legible, and aligned with the existing navigation. The cyber-security label is presented in the sidebar without horizontal overflow, and the reviewed page content remains unchanged.

3D shield-and-falcon animation review: desktop and 390px Dashboard captures show a cyber-green shield with layered depth, luminous scan beam, forward/back falcon motion, and articulated wing-flap layers. The existing sidebar, dashboard masthead, posture content, and navigation remain visually intact; the mobile capture shows no obvious clipping or horizontal overflow.

3D animation correction review: moved the falcon-flight layer outside the clipped shield polygon so the animated wings are visibly rendered in front of the shield. Desktop and 390px Dashboard captures now show the forward/back depth composition, green shield glow, and wing silhouettes without clipping or horizontal overflow.
