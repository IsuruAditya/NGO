# Stripe Donation Flow (SPA + Hono Architecture)

This architecture uses a React SPA frontend with a separate Hono API backend for Stripe payments.

---

## Payment Flow Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User as Donor
    participant UI as React SPA (Cloudflare Pages)
    participant API as Hono API (/api/donate/checkout)
    participant Stripe as Stripe Servers
    participant DB as Database (D1 / Supabase / Neon)

    User->>UI: Fill donation form & click "Donate"
    UI->>API: POST donor details (name, email, amount, programId)
    API->>Stripe: Create Checkout Session request
    Stripe-->>API: Return Checkout URL + Session ID
    API->>DB: Save donation as "pending"
    API-->>UI: Return Checkout URL
    UI->>User: Redirect to Stripe Checkout

    Note over User: Payment happens securely on Stripe

    Stripe->>User: Redirect to /success?session_id=xxx
    UI->>API: GET /api/verify-payment?session_id=xxx
    API->>Stripe: Verify payment status
    Stripe-->>API: Payment confirmed
    API->>DB: Update donation = success
    API-->>UI: Return success status
    UI-->>User: Show "Thank you" message