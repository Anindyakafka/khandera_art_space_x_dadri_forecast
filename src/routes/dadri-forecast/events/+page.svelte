<main class="dadri-page">
  <p class="kicker">Dadri Forecast</p>
  <h1>Events</h1>
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
    font-size: clamp(1.45rem, 4.8vw, 2.8rem);
  }

  .intro {
    margin: 0 0 1rem;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .timeline {
    margin: 0;
    padding: 0;
    list-style: none;
    border-left: 2px solid color-mix(in srgb, var(--accent) 45%, transparent);
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
