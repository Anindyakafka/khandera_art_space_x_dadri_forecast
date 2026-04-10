<main class="thanks-page" data-flow-copy>
  <p class="section-no" aria-hidden="true">15</p>
  <p class="kicker">Dadri Forecast / Support</p>
  <h1>Thank you for registering your support</h1>
  <span class="warning-bar">Your donation intent has been received</span>

  <p>
    The support form has been submitted. You can now complete the payment through the UPI or bank route shown on the support page.
  </p>
  <p>
    If you want to share payment confirmation, request receipts, or ask for fund-use updates, email
    <a href="mailto:anindya.econ@gmail.com">anindya.econ@gmail.com</a>.
  </p>

  <nav class="route-links" aria-label="Support navigation">
    <a href="/dadri-forecast/support">Back to Support</a>
    <a href="/dadri-forecast">Dadri Forecast Home</a>
  </nav>
</main>

<style>
  .thanks-page {
    width: min(900px, 95vw);
    margin: clamp(1rem, 3.5vw, 2.5rem) auto;
    color: var(--text);
    border-top: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
    border-bottom: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
    padding: clamp(1rem, 2.6vw, 1.8rem);
    background: color-mix(in srgb, var(--surface) 86%, transparent);
  }

  .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 700;
  }

  h1 {
    margin: 0.45rem 0 0.75rem;
    font-size: clamp(1.9rem, 6vw, 3.6rem);
    letter-spacing: 0.015em;
    line-height: 1;
  }

  p {
    margin: 0 0 0.8rem;
    line-height: 1.75;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  a {
    color: var(--accent);
    text-decoration: none;
  }

  .route-links {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .route-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    padding: 0.5rem 0.78rem;
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    color: color-mix(in srgb, var(--accent) 78%, var(--text));
  }
</style>
