# Specification

## Summary
**Goal:** Build a Minecraft-themed XtreamCloud hosting site with ID/password authentication, a plans-and-order flow that shows UPI QR payment details, and a post-payment hosting panel tied to the authenticated user.

**Planned changes:**
- Create a consistent Minecraft-inspired UI shell (purple + black palette) with navigation and prominent “XtreamCloud” branding across pages.
- Implement Page A (Auth) with Register/Login (ID + password) and session-aware routing (auto-redirect and an “Already logged in?” link) to Page B.
- Add backend ID/password auth with session handling (register, login, logout, session validation) and stable persistence in a single Motoko actor.
- Implement Page B (Plans) showing HEXO, METEOR, DOOMSDAY, XTREME with the exact prices/specs and an “ORDER NOW” action for each.
- Add a payment UI where users choose PhonePe/Google Pay/Paytm/UPI and, on Pay, display a QR code plus UPI payment details for the selected plan.
- Create Page C (Hosting Panel) accessible after the payment flow, showing the user’s purchased plan, allocated resources (SSD/RAM/CPU), and a process info section (simulated data allowed).
- Add backend order tracking to store and retrieve the authenticated user’s active/purchased plan for rendering on Page C.
- Generate and include Minecraft-inspired static branding assets (logo + background) under `frontend/public/assets/generated` and use them in the UI.

**User-visible outcome:** Users can register/login, view hosting plans, start an order and see UPI QR payment details for the chosen plan, then proceed to a hosting panel that displays their purchased plan and resource/process information on return visits (via session).
