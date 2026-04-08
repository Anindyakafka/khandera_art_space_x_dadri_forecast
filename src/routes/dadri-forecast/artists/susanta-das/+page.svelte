<main class="artist-page">
  <p class="section-no" aria-hidden="true">12</p>
  <p class="kicker">Dadri Forecast / Collaborator Profile</p>
  <h1>Susanta Das</h1>
  <span class="warning-bar">Mime Practitioner // Facilitator // Collective Process</span>

  <div class="profile-grid" data-flow-copy>
    <article class="profile-card">
      <p class="label">Role</p>
      <h2>Mime Practitioner / Facilitator</h2>
      <p>Susanta facilitated the Socho Toh process through embodied exploration, rhythmic tension, and non-verbal research tools.</p>
    </article>

    <article class="profile-card">
      <p class="label">Method</p>
      <h2>Practice in Friction</h2>
      <p>His approach is grounded in friction rather than ease, treating performance as a space where social pressure and lived conditions become legible through gesture.</p>
    </article>

    <article class="profile-card">
      <p class="label">Contribution</p>
      <h2>Collective Vocabulary</h2>
      <p>He supported participants in co-authoring a shared movement language that transformed exhaustion and exclusion into public expression and cultural intervention.</p>
    </article>
  </div>

  <nav class="profile-links" aria-label="Profile navigation">
    <a href="/dadri-forecast/projects">Back to Projects</a>
    <a href="/dadri-forecast/artists">Back to Collaborators</a>
  </nav>
</main>

<style>
  .artist-page {
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

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.7rem;
    margin-top: 1rem;
  }

  .profile-card {
    border-top: 2px solid color-mix(in srgb, var(--accent) 44%, var(--line));
    border-left: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--line) 72%, transparent);
    padding: 0.9rem 1rem;
    background: color-mix(in srgb, var(--surface) 82%, transparent);
    display: grid;
    gap: 0.4rem;
  }

  .label {
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

  .profile-card p:not(.label) {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, transparent);
    padding-top: 0.35rem;
    border-top: 1px solid color-mix(in srgb, var(--line) 55%, transparent);
  }

  .profile-links {
    margin-top: 1.1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .profile-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    padding: 0.5rem 0.78rem;
    border-radius: 0;
    text-decoration: none;
    font-size: 0.84rem;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .profile-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    color: color-mix(in srgb, var(--accent) 78%, var(--text));
  }
</style>
