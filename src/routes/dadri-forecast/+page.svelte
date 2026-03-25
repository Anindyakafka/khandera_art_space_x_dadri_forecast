<script lang="ts">
  export let data;

  const projectTitle = 'Socho To';
  const projectDate = '8 June';
  const projectPlace = 'Khandera village';
  const facilitator = 'Susanta Das';

  const folder = '/media/images/dadri-forecast/projects/Mime Workshop 2_Socho To_Susanta Das_for_upload';
  const galleryFiles = [
    'DSC_0090.JPG',
    'DSC_0093.JPG',
    'DSC_0099.JPG',
    'DSC_0102.JPG',
    'DSC_0109.JPG',
    'DSC_0117.JPG',
    'IMG_20250605_145424991_HDR.jpg',
    'IMG_20250608_193524298_HDR.jpg',
    'IMG_20250608_193815028_HDR.jpg',
    'IMG_2835.jpg',
    'IMG_2839.jpg',
    'IMG_2841.jpg',
    'IMG_2844.jpg',
    'IMG_2850.jpg',
    'IMG_2861.jpg'
  ];

  const gallery = galleryFiles.map((fileName) => ({
    src: encodeURI(`${folder}/${fileName}`),
    alt: `Socho To workshop image ${fileName}`
  }));
</script>

<main class="forecast-page">
  <section class="hero">
    <p class="kicker">Dadri Forecast Project Archive</p>
    <h1>{projectTitle}</h1>
    <p class="lead">
      A durational mime process built under heat, blackout, and infrastructural neglect in Khandera, where gesture became a grammar of resistance.
    </p>

    <div class="meta-row" role="list" aria-label="Project details">
      <p role="listitem"><strong>Date</strong> {projectDate}</p>
      <p role="listitem"><strong>Location</strong> {projectPlace}</p>
      <p role="listitem"><strong>Facilitator</strong> {facilitator}</p>
    </div>
  </section>

  <section class="writing" aria-labelledby="writeup-heading">
    <h2 id="writeup-heading">Project Write-up</h2>

    <p>
      On 8th June, Khandera Art Space hosted a compelling mime performance devised and performed by young participants of Khandera village, who had, over 13 days, endured heat, blackout, and infrastructural neglect during the workshop. Rehearsals were held in fragments of time and shade, amidst failing electricity and dehydrated afternoons. The body did not enact a script; it endured. Each movement registered the ambient conditions of exclusion, where breath replaced speech, and physicality became a grammar of resistance. This was not only creative indulgence but a durational negotiation with exhaustion, where choreography was metabolized into gesture. The performance unfolded not as spectacle, but as a convulsion of withheld expression.
    </p>

    <p>
      The process was facilitated by Susanta Das, a socio-politically engaged mime practitioner whose methods are grounded in friction, not ease. Through sequences of embodied exploration, rhythmic tension, and non-verbal syntax, the group co-authored a collective vocabulary that activated performance as a tool for cultural intervention and resistance. The performance, Socho To, takes its incantatory name from Gorakh Pandey's searing poem, a work that fractures the ordinary and reanimates it as a field of latent uprising. The performance dwells in that suspended state between stillness and rupture, charting ecological depletion, bulldozer politics, stigmatization, dislocation, systematic erasure, and slow attrition of dignity.
    </p>

    <p>
      Rooted in a location long neglected by the state and stigmatized under structural violence, the village and its people have historically been denied access to equitable resources, cultural capital, and platforms of visibility. Khandera is not a passive container for such acts. It is a landscape disfigured by casteist governance, where dispossession is routine and remembrance is a form of risk.
    </p>
  </section>

  <section class="gallery" aria-labelledby="gallery-heading">
    <div class="gallery-head">
      <h2 id="gallery-heading">Image Sequence</h2>
      <p>{gallery.length} images from the workshop process and performance evening.</p>
    </div>

    <div class="masonry" role="list">
      {#each gallery as image, index}
        <figure class="shot" role="listitem" style={`--order: ${index};`}>
          <img src={image.src} alt={image.alt} loading="lazy" />
        </figure>
      {/each}
    </div>
  </section>

  <nav class="route-links" aria-label="Other pages">
    <a href="/artists">Artists Page</a>
    <a href="/projects">Projects Page</a>
    <a href={data.site.manifestoDocumentPath} target="_blank" rel="noopener noreferrer">Download manifesto document</a>
  </nav>
</main>

<style>
  .forecast-page {
    width: min(1200px, 96vw);
    margin: clamp(1rem, 3.5vw, 2.8rem) auto clamp(2rem, 5vw, 4rem);
    color: var(--text);
  }

  .hero {
    padding: clamp(1rem, 2.6vw, 2rem);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background:
      radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 52%),
      radial-gradient(circle at 92% 84%, color-mix(in srgb, var(--hero-c) 14%, transparent), transparent 44%);
  }

  .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.74rem;
    color: var(--muted);
    font-weight: 700;
  }

  h1 {
    margin: 0.4rem 0 0.55rem;
    font-size: clamp(1.8rem, 6vw, 4rem);
    line-height: 0.98;
    text-wrap: balance;
  }

  .lead {
    margin: 0;
    max-width: 74ch;
    color: color-mix(in srgb, var(--text) 90%, transparent);
    font-size: clamp(0.98rem, 1.65vw, 1.2rem);
    line-height: 1.65;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 1rem;
  }

  .meta-row p {
    margin: 0;
    border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
    border-radius: 999px;
    padding: 0.38rem 0.75rem;
    font-size: 0.8rem;
    background: color-mix(in srgb, var(--surface) 86%, transparent);
  }

  .meta-row strong {
    margin-right: 0.4rem;
  }

  .writing {
    margin-top: clamp(1.2rem, 3vw, 2.1rem);
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.85rem;
    border-left: 2px solid color-mix(in srgb, var(--accent) 45%, transparent);
    padding-left: clamp(0.85rem, 2vw, 1.35rem);
  }

  .writing h2,
  .gallery h2 {
    margin: 0;
    font-size: clamp(1.1rem, 2.2vw, 1.7rem);
    letter-spacing: 0.02em;
  }

  .writing p {
    margin: 0;
    max-width: 88ch;
    line-height: 1.82;
    font-size: clamp(0.94rem, 1.4vw, 1.03rem);
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .gallery {
    margin-top: clamp(1.5rem, 4vw, 2.8rem);
  }

  .gallery-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.8rem;
    border-bottom: 1px solid var(--line);
    padding-bottom: 0.5rem;
    margin-bottom: 0.85rem;
  }

  .gallery-head p {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
  }

  .masonry {
    columns: 3 260px;
    column-gap: 0.7rem;
  }

  .shot {
    break-inside: avoid;
    margin: 0 0 0.7rem;
    border: 1px solid color-mix(in srgb, var(--line) 85%, transparent);
    background: color-mix(in srgb, var(--surface-solid) 88%, transparent);
    overflow: hidden;
    opacity: 0;
    transform: translateY(10px);
    animation: rise-in 420ms ease forwards;
    animation-delay: calc(var(--order) * 22ms);
  }

  .shot img {
    width: 100%;
    display: block;
    object-fit: cover;
    min-height: 170px;
    filter: saturate(1.03) contrast(1.02);
  }

  .route-links {
    margin-top: 1.15rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .route-links a {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--line);
    padding: 0.5rem 0.78rem;
    border-radius: 999px;
    text-decoration: none;
    font-size: 0.84rem;
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .route-links a:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--line));
    color: color-mix(in srgb, var(--accent) 78%, var(--text));
  }

  @keyframes rise-in {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 760px) {
    .forecast-page {
      width: min(96vw, 760px);
      margin-top: 0.9rem;
    }

    .hero {
      padding: 0.85rem;
    }

    .lead {
      font-size: 0.96rem;
      line-height: 1.58;
    }

    .writing {
      border-left-width: 1px;
      padding-left: 0.7rem;
      gap: 0.72rem;
    }

    .masonry {
      columns: 2 160px;
      column-gap: 0.55rem;
    }

    .shot {
      margin-bottom: 0.55rem;
    }

    .gallery-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }
  }
</style>
