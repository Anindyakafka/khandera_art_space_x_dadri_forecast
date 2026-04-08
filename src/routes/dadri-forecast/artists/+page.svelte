<main class="dadri-page">
  <p class="section-no" aria-hidden="true">04</p>
  <p class="kicker">Dadri Forecast</p>
  <h1>Collaborators</h1>
  <span class="warning-bar">Embodied Practice // Collective Voice // Refusal</span>

  <div class="list">
    <a class="artist-card" href="/dadri-forecast/artists/subhankar-sengupta" data-flow-copy>
      <p class="role">Visual Artist / Open Studio Lead</p>
      <h2>Subhankar Sengupta</h2>
      <p>A visual artist whose practice spans printmaking, sculpture, projection mapping, and video. His research connects the micro-politics of everyday life in Dadri with broader histories of extraction, erasure, and communal violence across West Bengal.</p>
    </a>

    <a class="artist-card" href="/dadri-forecast/artists/susanta-das" data-flow-copy>
      <p class="role">Mime Practitioner / Facilitator</p>
      <h2>Susanta Das</h2>
      <p>A socio-politically engaged mime practitioner whose methods are grounded in friction, not ease. His practice builds collective non-verbal vocabularies for cultural intervention and resistance.</p>
    </a>

    <a class="artist-card" href="/dadri-forecast/artists/collective-participants" data-flow-copy>
      <p class="role">Young Voices from Khandera Village</p>
      <h2>Collective Voices</h2>
      <p>Young collaborators who, over 13 days, endured heat, blackout, and infrastructural neglect to co-author a performance vocabulary rooted in embodied experience and defiance.</p>
    </a>
  </div>
</main>

<style>
  .dadri-page {
    width: min(980px, 95vw);
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

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.7rem;
    margin-top: 1rem;
  }

  .artist-card {
    border-top: 2px solid color-mix(in srgb, var(--accent) 44%, var(--line));
    border-left: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    padding: 0.9rem 1rem;
    background: color-mix(in srgb, var(--surface) 82%, transparent);
    display: grid;
    gap: 0.4rem;
    color: inherit;
    text-decoration: none;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .artist-card:hover {
    transform: translateY(-2px);
    border-top-color: color-mix(in srgb, var(--accent) 70%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
  }

  .role {
    margin: 0;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-weight: 700;
  }

  h2 {
    margin: 0;
    font-size: clamp(1.1rem, 2.6vw, 1.8rem);
    line-height: 1;
    letter-spacing: 0.01em;
  }

  .artist-card p:not(.role) {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, transparent);
    padding-top: 0.35rem;
    border-top: 1px solid color-mix(in srgb, var(--line) 55%, transparent);
  }
</style>
