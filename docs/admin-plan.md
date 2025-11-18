# Admin System Rollout Plan

## Phase 1 – Access & Foundations

- **Goal:** ensure only vetted staff reach admin tools and every action is traceable.
- Restrict `/api/auth/register` to `player|coach`; introduce invite-based admin creation flow (new `admin_invites` collection storing email, role, expiry, inviter).
- Add `adminAuth` middleware enforcing JWT role, invite acceptance, and optional MFA flag.
- Implement `AdminLog` model capturing `{actor, action, entityType, entityId, payloadPreview, createdAt}` and wrap sensitive routes with a logging helper.
- Scaffold `/admin` layout (sidebar, top nav, placeholder dashboard) and a client-side route guard redirecting non-admins.

## Phase 2 – Verification Inbox

- **Goal:** give reviewers a single queue with full context to approve or reject player verifications.
- Extend `/api/admin/verifications` with filters (`status`, `division`, `jucoProgram`, `updatedBefore/After`, `search`) plus pagination metadata.
- Expand detail endpoint to include player profile summary, stats snapshot, supporting file links, JUCO coach info, and verification history.
- Enhance approve/reject endpoints with optional canned responses, attachments, and ensure each transition logs to `AdminLog`.
- Frontend queue: table with status chips, player info, division, age, JUCO coach; detail drawer with full submission, history timeline, and action buttons with template notes, optimistic updates, and toasts.

## Phase 3 – Content Management (Announcements CMS)

- **Goal:** enable marketing to publish announcements without editing JSON manually.
- Create `Announcement` schema (existing JSON fields + `status`, `authorId`, `version`, timestamps).
- Build CRUD endpoints with validation, slug generation, publish scheduling; public `/api/announcements` now reads from Mongo (fallback to JSON if empty).
- Optionally integrate media storage (S3/Cloudinary) for announcement images; store URLs + alt text.
- Admin UI page listing drafts/published items with filters, editor form supporting rich text, CTA, scheduling, preview, and publish/clone/archive actions with audit logging.

## Phase 4 – User & Billing Oversight

- **Goal:** let support/admins resolve account and billing issues quickly.
- Add `/api/admin/users` endpoints for list/search (email, role, subscription status) and detail view (profiles, verification state, billing info).
- Provide mutations to trigger password reset emails, toggle suspension, update roles with guardrails, and manually adjust subscription status (e.g., complimentary plan) with required notes.
- Store Stripe webhook payloads + statuses for debugging via `/api/admin/billing/webhooks`.
- Frontend table + detail drawer with inline actions (reset password, suspend, resend verification email) and billing tab showing subscription timeline, invoice history, payment failure reasons.

## Phase 5 – Analytics & Alerts

- **Goal:** give leadership visibility and proactive notifications.
- Introduce aggregate endpoints (e.g., `GET /api/admin/stats/summary`) returning counts for pending verifications, new users, ARR/MRR, churn.
- Alert configuration endpoints store admin preferences (email/Slack/web push) for triggers like pending > threshold or Stripe failures; background job dispatches alerts.
- Dashboard cards + charts (weekly verification volume, plan mix) via lightweight chart lib, plus alert settings page allowing subscribe/unsubscribe with preview/test actions.

## Phase 6 – Hardening & Operational Docs

- **Goal:** support multi-role teams and audits confidently.
- Add permission matrix (`adminRoles` with support/marketing/compliance scopes) enforced in middleware and UI feature flags.
- Introduce MFA (email OTP or TOTP) for admin logins and optional IP allowlists for sensitive operations.
- Build in-app runbook pages outlining verification SOP, announcement workflow, escalation steps, linking to external docs where needed.
- Schedule security review (threat modeling / pen test) and feed findings into backlog.

## Collaboration Notes

- Ship each phase behind feature flags for staged QA and rollouts.
- Document API contracts and UI mocks in `/docs/admin/` (or equivalent) to keep engineering/design aligned.
- Update `.env.example`, README, and migration scripts whenever new collections or env vars are introduced.
- Host cross-team demos at the end of each phase so support/ops can provide feedback early.
