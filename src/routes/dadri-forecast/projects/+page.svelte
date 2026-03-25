<script lang="ts">
  const projectTitle = 'Socho Toh';
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
    alt: `Socho Toh workshop image ${fileName}`
  }));

  let selectedIndex: number | null = null;

  $: selectedImage = selectedIndex === null ? null : gallery[selectedIndex];

  function openLightbox(index: number) {
    selectedIndex = index;
  }

  function closeLightbox() {
    selectedIndex = null;
  }

  function showNext() {
    if (selectedIndex === null) {
      return;
    }

    selectedIndex = (selectedIndex + 1) % gallery.length;
  }

  function showPrevious() {
    if (selectedIndex === null) {
      return;
    }

    selectedIndex = (selectedIndex - 1 + gallery.length) % gallery.length;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (selectedIndex === null) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    }

    if (event.key === 'ArrowRight') {
      showNext();
    }

    if (event.key === 'ArrowLeft') {
      showPrevious();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

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
      The process was facilitated by Susanta Das, a socio-politically engaged mime practitioner whose methods are grounded in friction, not ease. Through sequences of embodied exploration, rhythmic tension, and non-verbal syntax, the group co-authored a collective vocabulary that activated performance as a tool for cultural intervention and resistance. The performance, Socho Toh, takes its incantatory name from Gorakh Pandey's searing poem, a work that fractures the ordinary and reanimates it as a field of latent uprising. The performance dwells in that suspended state between stillness and rupture, charting ecological depletion, bulldozer politics, stigmatization, dislocation, systematic erasure, and slow attrition of dignity.
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
          <button
            class="shot-button"
            type="button"
            on:click={() => openLightbox(index)}
            aria-label={`Open image ${index + 1} in fullscreen`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
          </button>
        </figure>
      {/each}
    </div>
  </section>

  <nav class="route-links" aria-label="Other pages">
    <a href="/dadri-forecast">Dadri Forecast Home</a>
    <a href="/dadri-forecast/about">About</a>
    <a href="/dadri-forecast/artists">Artists</a>
    <a href="/dadri-forecast/events">Events</a>
  </nav>
</main>

{#if selectedImage}
  <section class="lightbox" aria-label="Fullscreen image viewer" on:click={closeLightbox}>
    <button class="lightbox-close" type="button" on:click|stopPropagation={closeLightbox} aria-label="Close fullscreen view">
      Close
    </button>

    <button class="lightbox-nav prev" type="button" on:click|stopPropagation={showPrevious} aria-label="Show previous image">
      Prev
    </button>

    <figure class="lightbox-frame" on:click|stopPropagation>
      <img src={selectedImage.src} alt={selectedImage.alt} />
      <figcaption>{selectedIndex + 1} / {gallery.length}</figcaption>
    </figure>

    <button class="lightbox-nav next" type="button" on:click|stopPropagation={showNext} aria-label="Show next image">
      Next
    </button>
  </section>
{/if}

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
      repeating-linear-gradient(120deg, color-mix(in srgb, var(--accent) 14%, transparent) 0 2px, transparent 2px 18px),
      radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 52%),
      radial-gradient(circle at 92% 84%, color-mix(in srgb, var(--hero-c) 24%, transparent), transparent 44%);
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
    font-size: clamp(2.2rem, 9vw, 6rem);
    line-height: 0.98;
    text-wrap: balance;
    letter-spacing: 0.014em;
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
    border-radius: 0;
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
    border-bottom: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
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
    border: 1px solid color-mix(in srgb, var(--accent) 38%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 88%, transparent);
    overflow: hidden;
    opacity: 0;
    transform: translateY(10px);
    animation: rise-in 420ms ease forwards;
    animation-delay: calc(var(--order) * 22ms);
  }

  .shot-button {
    display: block;
    width: 100%;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: zoom-in;
  }

  .shot img {
    width: 100%;
    display: block;
    object-fit: cover;
    min-height: 170px;
    filter: saturate(0.92) contrast(1.12) brightness(0.94);
  }

  .lightbox {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: color-mix(in srgb, #000 88%, transparent);
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.8rem;
    padding: clamp(0.8rem, 2.4vw, 1.4rem);
  }

  .lightbox-frame {
    margin: 0;
    display: grid;
    justify-items: center;
    gap: 0.4rem;
    max-height: 92vh;
  }

  .lightbox-frame img {
    max-width: min(92vw, 1400px);
    max-height: 84vh;
    width: auto;
    height: auto;
    object-fit: contain;
    box-shadow: 0 18px 42px rgba(0, 0, 0, 0.45);
  }

  .lightbox-frame figcaption {
    color: #f4f4f4;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
  }

  .lightbox-close,
  .lightbox-nav {
    border: 1px solid color-mix(in srgb, #fff 36%, transparent);
    background: color-mix(in srgb, #111 68%, transparent);
    color: #fff;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border-radius: 0;
    padding: 0.45rem 0.72rem;
    cursor: pointer;
  }

  .lightbox-close {
    position: absolute;
    top: 0.85rem;
    right: 0.9rem;
  }

  .lightbox-nav.prev {
    justify-self: start;
  }

  .lightbox-nav.next {
    justify-self: end;
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
    border-radius: 0;
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

    .lightbox {
      grid-template-columns: 1fr;
      justify-items: center;
      gap: 0.55rem;
      padding: 0.65rem;
    }

    .lightbox-frame img {
      max-width: 95vw;
      max-height: 79vh;
    }

    .lightbox-nav {
      position: fixed;
      bottom: 0.9rem;
    }

    .lightbox-nav.prev {
      left: 0.75rem;
      justify-self: auto;
    }

    .lightbox-nav.next {
      right: 0.75rem;
      justify-self: auto;
    }

    .lightbox-close {
      top: 0.65rem;
      right: 0.65rem;
    }
  }
</style>
