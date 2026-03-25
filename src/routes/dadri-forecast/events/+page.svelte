<main class="dadri-page">
  <p class="section-no" aria-hidden="true">05</p>
  <p class="kicker">Dadri Forecast</p>
  <h1>Events</h1>
  <span class="warning-bar">Public Assembly // Tactical Culture // Field Action</span>
  <p class="intro">This events timeline is dedicated to Dadri Forecast activities and is separate from the Khandera events page.</p>

  <ol class="timeline">
    <li>
      <p class="date">8 June</p>
      <h2>Socho Toh Performance</h2>
      <p>Mime performance developed through a 13-day workshop process in Khandera village.</p>
    </li>
  </ol>
</main>

<style>
  .dadri-page {
    width: min(920px, 95vw);
    margin: clamp(1rem, 3.5vw, 2.5rem) auto;
    color: var(--text);
    border-top: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
    padding-top: 0.9rem;
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
    font-size: clamp(1.8rem, 7vw, 4.2rem);
    letter-spacing: 0.015em;
  }

  .intro {
    margin: 0 0 1rem;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .timeline {
    margin: 0;
    padding: 0;
    list-style: none;
    border-left: 3px solid color-mix(in srgb, var(--accent) 74%, transparent);
    background: color-mix(in srgb, var(--surface) 75%, transparent);
  }

  .timeline li {
    padding: 0.2rem 0 0.9rem 0.9rem;
  }

  .date {
    margin: 0;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    color: var(--muted);
    text-transform: uppercase;
  }

  h2 {
    margin: 0.25rem 0 0.35rem;
    font-size: 1.08rem;
  }

  .timeline li p {
    margin: 0;
    line-height: 1.7;
  }
</style>
