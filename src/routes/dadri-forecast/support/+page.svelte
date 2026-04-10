<script lang="ts">
  import type { DonationSettings, SupportFund } from '$lib/content/types';

  type PaymentMethod = 'upi' | 'bank';

  export let data: { funds?: SupportFund[]; settings?: DonationSettings };

  const funds: SupportFund[] = data.funds ?? [];
  const settings = data.settings;
  const paymentMode = settings?.payment.mode ?? 'both';
  const contactEmail = settings?.contact.primaryEmail ?? '';
  const transparencyEmail = settings?.contact.transparencyEmail ?? contactEmail;
  const defaultReason = funds[0]?.title ?? 'General support';
  let selectedReason = defaultReason;
  let selectedPaymentMethod: PaymentMethod = paymentMode === 'bank' ? 'bank' : 'upi';

  function formatCurrency(value: number | null) {
    if (value === null) {
      return 'TBA';
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }

  function getRemainingLabel(fund: SupportFund) {
    if (fund.targetAmount === null) {
      return 'Open fund';
    }

    return formatCurrency(Math.max(fund.targetAmount - fund.spentAmount, 0));
  }

  function chooseFund(title: string) {
    selectedReason = title;

    if (typeof document === 'undefined') {
      return;
    }

    document.getElementById('donor-intake')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  function choosePaymentMethod(method: PaymentMethod) {
    selectedPaymentMethod = method;
  }

  $: if (paymentMode === 'bank' && selectedPaymentMethod !== 'bank') {
    selectedPaymentMethod = 'bank';
  }

  $: if (paymentMode === 'upi' && selectedPaymentMethod !== 'upi') {
    selectedPaymentMethod = 'upi';
  }
</script>

<main class="support-page">
  <section class="support-hero" data-flow-copy>
    <p class="section-no" aria-hidden="true">14</p>
    <p class="kicker">Dadri Forecast / Support</p>
    <h1>Support the Work</h1>
    <span class="warning-bar">Transparent donations // UPI + bank transfer // creative QR to follow</span>
    <p>
      Every contribution can be tagged to a specific need and tracked here as the work grows — from cab rides and stationery to equipment,
      exhibitions, and project-specific support.
    </p>
    <p>
      For now, this page collects donor information for every contribution attempt so the team can follow up with payment details, receipts,
      bills, and updates whenever a donor opts in.
    </p>
  </section>

  <section class="funds" aria-labelledby="funds-heading">
    <div class="section-head">
      <h2 id="funds-heading">Choose what you want to support</h2>
      <p>Select a fund below to pre-fill the donor form.</p>
    </div>

    <div class="fund-grid">
      {#each funds as fund}
        <article class="fund-card">
          <p class="fund-kicker">{fund.lastUpdated}</p>
          <h3>{fund.title}</h3>
          <p class="fund-summary">{fund.summary}</p>

          <dl class="fund-stats">
            <div>
              <dt>Target</dt>
              <dd>{formatCurrency(fund.targetAmount)}</dd>
            </div>
            <div>
              <dt>Received</dt>
              <dd>{formatCurrency(fund.receivedAmount)}</dd>
            </div>
            <div>
              <dt>Spent</dt>
              <dd>{formatCurrency(fund.spentAmount)}</dd>
            </div>
            <div>
              <dt>Remaining</dt>
              <dd>{getRemainingLabel(fund)}</dd>
            </div>
          </dl>

          <p class="status-note">{fund.statusNote}</p>
          <button type="button" class="select-button" on:click={() => chooseFund(fund.title)}>Support this need</button>
        </article>
      {/each}
    </div>
  </section>

  <section class="payment-panel" aria-labelledby="payment-heading">
    <div class="section-head">
      <h2 id="payment-heading">Choose a payment route</h2>
      <p>
        {#if paymentMode === 'both'}
          UPI and bank transfer are both available right now.
        {:else if paymentMode === 'upi'}
          UPI is currently active for this support flow.
        {:else}
          Bank transfer is currently active for this support flow.
        {/if}
      </p>
    </div>

    {#if paymentMode === 'both'}
      <div class="method-switch" role="tablist" aria-label="Payment method selector">
        <button
          type="button"
          class:selected={selectedPaymentMethod === 'upi'}
          on:click={() => choosePaymentMethod('upi')}
          aria-pressed={selectedPaymentMethod === 'upi'}
        >
          UPI
        </button>
        <button
          type="button"
          class:selected={selectedPaymentMethod === 'bank'}
          on:click={() => choosePaymentMethod('bank')}
          aria-pressed={selectedPaymentMethod === 'bank'}
        >
          Bank transfer
        </button>
      </div>
    {/if}

    {#if selectedPaymentMethod === 'upi'}
      <article class="payment-card">
        <p class="fund-kicker">UPI payment</p>
        <h3>{settings?.payment.upi.payeeName}</h3>
        <dl class="payment-details">
          <div>
            <dt>UPI ID</dt>
            <dd>{settings?.payment.upi.id}</dd>
          </div>
          <div>
            <dt>Payee name</dt>
            <dd>{settings?.payment.upi.payeeName}</dd>
          </div>
        </dl>
        <p class="status-note">{settings?.payment.upi.note}</p>
        <p class="status-note">Creative QR artwork will appear here once it is finalized.</p>
      </article>
    {:else}
      <article class="payment-card">
        <p class="fund-kicker">Bank transfer</p>
        <h3>{settings?.payment.bank.accountHolder}</h3>
        <dl class="payment-details">
          <div>
            <dt>Bank</dt>
            <dd>{settings?.payment.bank.bankName}</dd>
          </div>
          <div>
            <dt>Account number</dt>
            <dd>{settings?.payment.bank.accountNumber}</dd>
          </div>
          <div>
            <dt>IFSC</dt>
            <dd>{settings?.payment.bank.ifsc}</dd>
          </div>
          <div>
            <dt>Branch</dt>
            <dd>{settings?.payment.bank.branch}</dd>
          </div>
        </dl>
      </article>
    {/if}

    <p class="contact-line">
      For payment confirmation, receipt requests, or donation-use updates, write to
      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
    </p>
  </section>

  <section class="donor-panel" id="donor-intake">
    <div class="section-head">
      <h2>Donor information</h2>
      <p>We collect this for every contribution so the support can be documented properly and updates can be shared if requested.</p>
    </div>

    <div class="donor-grid">
      <form
        class="support-form"
        name="dadri-support"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        action="/dadri-forecast/support"
      >
        <input type="hidden" name="form-name" value="dadri-support" />
        <p class="sr-only">
          <label>Do not fill this field if you are human <input name="bot-field" /></label>
        </p>
        <input type="hidden" name="selected_reason" value={selectedReason} />

        <label class="field">
          <span>Full name</span>
          <input name="full_name" type="text" autocomplete="name" required />
        </label>

        <label class="field">
          <span>Email</span>
          <input name="email" type="email" autocomplete="email" required />
        </label>

        <label class="field">
          <span>Phone / WhatsApp</span>
          <input name="phone_whatsapp" type="tel" autocomplete="tel" />
        </label>

        <label class="field">
          <span>Preferred contact method</span>
          <select name="preferred_contact" required>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="No follow-up needed">No follow-up needed</option>
          </select>
        </label>

        <label class="field field-full">
          <span>Donation reason</span>
          <select name="donation_reason" bind:value={selectedReason} required>
            {#each funds as fund}
              <option value={fund.title}>{fund.title}</option>
            {/each}
            <option value="General support">General support</option>
          </select>
        </label>

        <label class="field">
          <span>Preferred payment route</span>
          <select name="payment_method" bind:value={selectedPaymentMethod} required>
            {#if paymentMode !== 'bank'}
              <option value="upi">UPI</option>
            {/if}
            {#if paymentMode !== 'upi'}
              <option value="bank">Bank transfer</option>
            {/if}
          </select>
        </label>

        <label class="field">
          <span>Amount (INR)</span>
          <input name="amount_inr" type="number" min="1" step="1" placeholder="Optional" />
        </label>

        <label class="field">
          <span>Organisation / location</span>
          <input name="organisation_or_location" type="text" placeholder="Optional" />
        </label>

        <fieldset class="choices field-full">
          <legend>Documentation preferences</legend>
          <label><input type="checkbox" name="wants_receipts" value="yes" checked /> Send bills / receipts when available</label>
          <label><input type="checkbox" name="wants_updates" value="yes" checked /> Send usage updates for this fund</label>
          <label><input type="checkbox" name="anonymous_donor" value="yes" /> Keep my donation publicly anonymous</label>
        </fieldset>

        <input type="hidden" name="admin_contact_email" value={contactEmail} />
        <input type="hidden" name="transparency_contact_email" value={transparencyEmail} />

        <label class="field field-full">
          <span>Message</span>
          <textarea
            name="message"
            rows="5"
            placeholder="Mention the exact project, a question, or anything you want the team to know."
          ></textarea>
        </label>

        <button class="submit-button" type="submit">Register this support</button>
      </form>

      <aside class="support-note" data-flow-copy>
        <h2>What happens next</h2>
        <ol>
          <li>Your preferred support reason and payment route are logged with your details.</li>
          <li>You can use the selected UPI or bank details shown above and then share confirmation if needed.</li>
          <li>If you opt in, receipts, bills, or spending updates can be shared back with you at <a href={`mailto:${transparencyEmail}`}>{transparencyEmail}</a>.</li>
          <li>The public log on this page can be updated to show how much has been spent and what remains.</li>
        </ol>

        <div class="qr-placeholder">
          <p class="kicker">UPI block reserved</p>
          <p>The custom UPI QR artwork can be dropped here once you share the visual reference.</p>
        </div>
      </aside>
    </div>
  </section>

  <nav class="route-links" aria-label="Other Dadri Forecast pages">
    <a href="/dadri-forecast">Dadri Forecast Home</a>
    <a href="/dadri-forecast/about">About</a>
    <a href="/dadri-forecast/projects">Projects</a>
    <a href="/dadri-forecast/artists">Collaborators</a>
    <a href="/dadri-forecast/events">Events</a>
  </nav>
</main>

<style>
  .support-page {
    width: min(1180px, 96vw);
    margin: clamp(1rem, 3.5vw, 2.8rem) auto clamp(2rem, 5vw, 4rem);
    color: var(--text);
  }

  .support-hero {
    display: grid;
    gap: 0.65rem;
    border-top: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
    border-bottom: 1px solid color-mix(in srgb, var(--line) 80%, transparent);
    padding: clamp(1rem, 2.8vw, 1.8rem) 0;
  }

  .kicker,
  .fund-kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 700;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 7vw, 4.8rem);
    letter-spacing: 0.015em;
    line-height: 0.95;
  }

  .support-hero p:not(.kicker) {
    margin: 0;
    max-width: 78ch;
    line-height: 1.75;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .funds,
  .payment-panel,
  .donor-panel {
    margin-top: clamp(1.2rem, 3vw, 2rem);
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 1rem;
    border-bottom: 2px solid color-mix(in srgb, var(--accent) 58%, var(--line));
    padding-bottom: 0.55rem;
    margin-bottom: 0.9rem;
  }

  .section-head h2 {
    margin: 0;
    font-size: clamp(1.2rem, 2.6vw, 1.8rem);
  }

  .section-head p {
    margin: 0;
    color: var(--muted);
    font-size: 0.88rem;
  }

  .fund-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .fund-card,
  .payment-card,
  .support-note {
    border: 1px solid color-mix(in srgb, var(--line) 82%, transparent);
    border-top: 2px solid color-mix(in srgb, var(--accent) 48%, var(--line));
    background: color-mix(in srgb, var(--surface) 84%, transparent);
    padding: 0.95rem 1rem;
  }

  .fund-card,
  .payment-card {
    display: grid;
    gap: 0.7rem;
  }

  .method-switch {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-bottom: 0.8rem;
  }

  .method-switch button {
    border: 1px solid color-mix(in srgb, var(--line) 82%, transparent);
    background: color-mix(in srgb, var(--surface) 84%, transparent);
    color: inherit;
    padding: 0.55rem 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.76rem;
    cursor: pointer;
  }

  .method-switch button.selected {
    border-color: color-mix(in srgb, var(--accent) 72%, var(--line));
    color: var(--accent);
  }

  .fund-card h3,
  .payment-card h3,
  .support-note h2 {
    margin: 0;
    font-size: clamp(1.05rem, 2.2vw, 1.35rem);
  }

  .fund-summary,
  .status-note,
  .support-note p,
  .support-note li {
    margin: 0;
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .fund-stats,
  .payment-details {
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.55rem;
  }

  .fund-stats div,
  .payment-details div {
    border: 1px solid color-mix(in srgb, var(--line) 62%, transparent);
    padding: 0.45rem 0.55rem;
    background: color-mix(in srgb, var(--bg) 68%, transparent);
  }

  .fund-stats dt,
  .payment-details dt {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }

  .fund-stats dd,
  .payment-details dd {
    margin: 0.2rem 0 0;
    font-size: 0.95rem;
    word-break: break-word;
  }

  .contact-line {
    margin: 0.8rem 0 0;
    line-height: 1.7;
  }

  .contact-line a,
  .support-note a {
    color: var(--accent);
    text-decoration: none;
  }

  .select-button,
  .submit-button {
    border: 1px solid color-mix(in srgb, var(--accent) 55%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 88%, transparent);
    color: inherit;
    padding: 0.65rem 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.76rem;
    cursor: pointer;
  }

  .select-button:hover,
  .submit-button:hover {
    color: var(--accent);
    border-color: color-mix(in srgb, var(--accent) 78%, var(--line));
  }

  .donor-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 0.8rem;
    align-items: start;
  }

  .support-form {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--line) 82%, transparent);
    border-top: 2px solid color-mix(in srgb, var(--accent) 52%, var(--line));
    background: color-mix(in srgb, var(--surface) 86%, transparent);
    padding: 1rem;
  }

  .field {
    display: grid;
    gap: 0.35rem;
  }

  .field span,
  .choices legend {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
    font-weight: 700;
  }

  .field input,
  .field select,
  .field textarea {
    width: 100%;
    border: 1px solid color-mix(in srgb, var(--line) 82%, transparent);
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    color: inherit;
    padding: 0.68rem 0.75rem;
    border-radius: 0;
    font: inherit;
  }

  .field textarea {
    resize: vertical;
  }

  .field-full,
  .choices,
  .submit-button {
    grid-column: 1 / -1;
  }

  .choices {
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    padding: 0.75rem;
    display: grid;
    gap: 0.45rem;
  }

  .choices label {
    display: flex;
    gap: 0.5rem;
    align-items: start;
    line-height: 1.5;
  }

  .support-note {
    display: grid;
    gap: 0.8rem;
  }

  .support-note ol {
    margin: 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.45rem;
  }

  .qr-placeholder {
    border-top: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
    padding-top: 0.7rem;
  }

  .route-links {
    margin-top: 1.1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .route-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    padding: 0.5rem 0.78rem;
    text-decoration: none;
    font-size: 0.84rem;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    color: color-mix(in srgb, var(--accent) 78%, var(--text));
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (max-width: 900px) {
    .donor-grid,
    .support-form {
      grid-template-columns: 1fr;
    }
  }
</style>
