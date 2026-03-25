<main class="dadri-page">
  <p class="kicker">Dadri Forecast</p>
  <h1>Artists</h1>
  <p class="intro">This is the Dadri Forecast artists section, intentionally separate from Khandera's main artists page.</p>

  <div class="list">
    <article>
      <h2>Collective Participants</h2>
      <p>Young participants and collaborators from Khandera village engaging through embodied, process-based performance practices.</p>
    </article>

    <article>
      <h2>Facilitating Practitioner</h2>
      <p>Susanta Das, socio-politically engaged mime practitioner, guiding non-verbal research vocabularies for collective action.</p>
    </article>
  </div>
</main>

<style>
  .dadri-page {
    width: min(980px, 95vw);
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
    margin: 0 0 0.9rem;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.7rem;
  }

  article {
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    padding: 0.9rem 0.2rem;
  }

  h2 {
    margin: 0 0 0.4rem;
    font-size: 1.08rem;
  }

  article p {
    margin: 0;
    line-height: 1.7;
  }
</style>
