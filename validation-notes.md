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
