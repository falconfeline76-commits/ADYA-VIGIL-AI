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
