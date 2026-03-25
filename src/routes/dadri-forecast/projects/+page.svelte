<script lang="ts">
  type CollaboratingArtist = {
    name: string;
    role: string;
    href: string;
    description?: string;
  };

  type Project = {
    id: string;
    title: string;
    format: string;
    date?: string;
    location?: string;
    facilitator?: string;
    warning: string;
    lead: string;
    excerpt: string;
    folder: string;
    galleryFiles: string[];
    gallery: { src: string; alt: string }[];
    writeup: string[];
    collaboratingArtists: CollaboratingArtist[];
  };

  function createGallery(projectTitle: string, folder: string, galleryFiles: string[]) {
    return galleryFiles.map((fileName) => ({
      src: encodeURI(`${folder}/${fileName}`),
      alt: `${projectTitle} documentation ${fileName}`
    }));
  }

  const projects: Project[] = [
    {
      id: 'socho-toh',
      title: 'Socho Toh',
      format: 'Mime Workshop / Collective Performance',
      date: '8 June',
      location: 'Khandera village',
      facilitator: 'Susanta Das',
      warning: 'Performance Under Heat, Blackout, and Structural Exclusion',
      lead:
        'A durational mime process built under heat, blackout, and infrastructural neglect in Khandera, where gesture became a grammar of resistance.',
      excerpt:
        'Young participants turned exhaustion, interruption, and withheld resources into a charged collective performance.',
      folder: '/media/images/dadri-forecast/projects/Mime Workshop 2_Socho To_Susanta Das_for_upload',
      galleryFiles: [
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
        'IMG_2850.jpg'
      ],
      gallery: createGallery(
        'Socho Toh',
        '/media/images/dadri-forecast/projects/Mime Workshop 2_Socho To_Susanta Das_for_upload',
        [
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
          'IMG_2850.jpg'
        ]
      ),
      writeup: [
        'On 8th June, Khandera Art Space hosted a compelling mime performance devised and performed by young participants of Khandera village, who had, over 13 days, endured heat, blackout, and infrastructural neglect during the workshop. Rehearsals were held in fragments of time and shade, amidst failing electricity and dehydrated afternoons. The body did not enact a script; it endured. Each movement registered the ambient conditions of exclusion, where breath replaced speech, and physicality became a grammar of resistance. This was not only creative indulgence but a durational negotiation with exhaustion, where choreography was metabolized into gesture. The performance unfolded not as spectacle, but as a convulsion of withheld expression.',
        'The process was facilitated by Susanta Das, a socio-politically engaged mime practitioner whose methods are grounded in friction, not ease. Through sequences of embodied exploration, rhythmic tension, and non-verbal syntax, the group co-authored a collective vocabulary that activated performance as a tool for cultural intervention and resistance. The performance, Socho Toh, takes its incantatory name from Gorakh Pandey\'s searing poem, a work that fractures the ordinary and reanimates it as a field of latent uprising. The performance dwells in that suspended state between stillness and rupture, charting ecological depletion, bulldozer politics, stigmatization, dislocation, systematic erasure, and slow attrition of dignity.',
        'Rooted in a location long neglected by the state and stigmatized under structural violence, the village and its people have historically been denied access to equitable resources, cultural capital, and platforms of visibility. Khandera is not a passive container for such acts. It is a landscape disfigured by casteist governance, where dispossession is routine and remembrance is a form of risk.'
      ],
      collaboratingArtists: [
        {
          name: 'Susanta Das',
          role: 'Mime Practitioner / Facilitator',
          href: '/dadri-forecast/artists/susanta-das',
          description:
            'A socio-politically engaged mime practitioner whose methods are grounded in friction, not ease. His practice builds collective non-verbal vocabularies for cultural intervention and resistance.'
        },
        {
          name: 'Collective Participants',
          role: 'Young Artists from Khandera Village',
          href: '/dadri-forecast/artists/collective-participants',
          description:
            'Young participants who, over 13 days, endured heat, blackout, and infrastructural neglect to co-author a performance vocabulary rooted in embodied experience and defiance.'
        }
      ]
    },
    {
      id: 'what-we-ask-when-we-stay',
      title: 'What We Ask, When We Stay',
      format: 'Open Studio / Lecture-Performance',
      facilitator: 'Subhankar Sengupta',
      warning: 'Open Inquiry Across Extraction, Erasure, Resistance, and Communal Violence',
      lead:
        'Through printmaking, sculpture, projection mapping, and video, the open studio traced the quiet yet urgent politics of place rooted in the landscapes around Dadri and NTPC.',
      excerpt:
        'An evening of reflection and participation where fractured lands, communal wounds, and systemic violence were held as a shared inquiry.',
      folder: '/media/images/dadri-forecast/projects/What We Ask, When We Stay_Open Studio_Subhankar Sengupta',
      galleryFiles: [
        '370A4516.JPG',
        '370A4520.JPG',
        '370A4534.JPG',
        '370A4541.JPG',
        '370A4547.JPG',
        '370A4552.JPG',
        '370A4563.JPG',
        'DSC_0126.JPG',
        'DSC_0128.JPG',
        'DSC_0129.JPG',
        'DSC_0149.JPG',
        'DSC_0154.JPG',
        'DSC_0156.JPG'
      ],
      gallery: createGallery(
        'What We Ask, When We Stay',
        '/media/images/dadri-forecast/projects/What We Ask, When We Stay_Open Studio_Subhankar Sengupta',
        [
          '370A4516.JPG',
          '370A4520.JPG',
          '370A4534.JPG',
          '370A4541.JPG',
          '370A4547.JPG',
          '370A4552.JPG',
          '370A4563.JPG',
          'DSC_0126.JPG',
          'DSC_0128.JPG',
          'DSC_0129.JPG',
          'DSC_0149.JPG',
          'DSC_0154.JPG',
          'DSC_0156.JPG'
        ]
      ),
      writeup: [
        'Evening of reflection, participation, and conversation.',
        'Through printmaking, sculpture, projection mapping, and video, Subhankar\'s open studio traced the quiet yet urgent politics of place, rooted in the landscapes around Dadri and NTPC.',
        'His lecture-performance wove together years of research and creative engagement across West Bengal, Telinipara, Deucha, Harishpur, and Barabani, sites marked by extraction, erasure, resistance, and communal violence.',
        'How do we speak of fractured lands and lives, of communal wounds and systemic violence? And more so, how do we speak of them to both children and adults, without silencing or simplifying?',
        'What emerges is not just a narrative, but a shared inquiry into staying, into listening, into reimagining.'
      ],
      collaboratingArtists: [
        {
          name: 'Subhankar Sengupta',
          role: 'Visual Artist / Open Studio Lead',
          href: '/dadri-forecast/artists/subhankar-sengupta',
          description:
            'A visual artist whose practice spans printmaking, sculpture, projection mapping, and video. His research connects the micro-politics of everyday life in Dadri with broader histories of extraction, erasure, and communal violence across West Bengal.'
        }
      ]
    }
  ];

  let activeProjectId = projects[0].id;
  let selectedIndex: number | null = null;

  $: activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  $: activeGallery = activeProject.gallery;
  $: selectedImage = selectedIndex === null ? null : activeGallery[selectedIndex];

  function selectProject(projectId: string) {
    activeProjectId = projectId;
    selectedIndex = null;
  }

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

    selectedIndex = (selectedIndex + 1) % activeGallery.length;
  }

  function showPrevious() {
    if (selectedIndex === null) {
      return;
    }

    selectedIndex = (selectedIndex - 1 + activeGallery.length) % activeGallery.length;
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
  <section class="archive-index" aria-labelledby="project-selector-heading">
    <p class="section-no" aria-hidden="true">06</p>
    <div class="archive-head">
      <p class="kicker">Dadri Forecast Project Archive</p>
      <h1 id="project-selector-heading">Choose a project file to enter</h1>
      <span class="warning-bar">Select a block to load documents, images, and field notes</span>
    </div>

    <div class="selector-grid" role="list" aria-label="Dadri Forecast projects">
      {#each projects as project, index}
        <button
          class:selected={project.id === activeProject.id}
          class="selector-card"
          type="button"
          on:click={() => selectProject(project.id)}
          aria-pressed={project.id === activeProject.id}
        >
          <span class="selector-number">{String(index + 1).padStart(2, '0')}</span>
          <div class="selector-copy">
            <p>{project.format}</p>
            <h2>{project.title}</h2>
            <p class="selector-excerpt">{project.excerpt}</p>
          </div>

          <div class="selector-footer">
            <span>{project.gallery.length} images</span>
            <span>{project.facilitator}</span>
          </div>
        </button>
      {/each}
    </div>
  </section>

  {#key activeProject.id}
    <section class="hero">
      <p class="section-no" aria-hidden="true">07</p>
      <p class="kicker">{activeProject.format}</p>
      <h2 class="hero-title">{activeProject.title}</h2>
      <span class="warning-bar">{activeProject.warning}</span>
      <p class="lead">{activeProject.lead}</p>

      <div class="meta-row" role="list" aria-label="Project details">
        {#if activeProject.date}
          <p role="listitem"><strong>Date</strong> {activeProject.date}</p>
        {/if}
        {#if activeProject.location}
          <p role="listitem"><strong>Location</strong> {activeProject.location}</p>
        {/if}
        {#if activeProject.facilitator}
          <p role="listitem"><strong>Facilitator</strong> {activeProject.facilitator}</p>
        {/if}
      </div>
    </section>

    <section class="writing" aria-labelledby="writeup-heading">
      <p class="section-no" aria-hidden="true">08</p>
      <div class="writing-head">
        <h2 id="writeup-heading">What? Why?</h2>
        <p>Active file: {activeProject.title}</p>
      </div>

      {#each activeProject.writeup as paragraph}
        <p>{paragraph}</p>
      {/each}
    </section>

    <section class="collab-artists" aria-labelledby="collab-heading">
      <p class="section-no" aria-hidden="true">09</p>
      <div class="collab-head">
        <h2 id="collab-heading">Collaborating Artists</h2>
        <p>{activeProject.collaboratingArtists.length} contributor{activeProject.collaboratingArtists.length > 1 ? 's' : ''}</p>
      </div>
      <div class="collab-grid">
        {#each activeProject.collaboratingArtists as artist}
          <a class="collab-card" href={artist.href}>
            <p class="collab-role">{artist.role}</p>
            <h3 class="collab-name">{artist.name}</h3>
            {#if artist.description}
              <p class="collab-desc">{artist.description}</p>
            {/if}
          </a>
        {/each}
      </div>
    </section>

    <section class="gallery" aria-labelledby="gallery-heading">
      <p class="section-no" aria-hidden="true">10</p>
      <div class="gallery-head">
        <h2 id="gallery-heading">Image Sequence</h2>
        <p>{activeGallery.length} images from {activeProject.title}.</p>
      </div>

      <div class="masonry" role="list">
        {#each activeGallery as image, index (image.src)}
          <figure class="shot distressed-media" role="listitem" style={`--order: ${index};`}>
            <button
              class="shot-button"
              type="button"
              on:click={() => openLightbox(index)}
              aria-label={`Open image ${index + 1} from ${activeProject.title} in fullscreen`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" />
            </button>
          </figure>
        {/each}
      </div>
    </section>
  {/key}

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
      <figcaption>{activeProject.title} // {selectedIndex + 1} / {activeGallery.length}</figcaption>
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

  .archive-index,
  .hero {
    padding: clamp(1rem, 2.6vw, 2rem);
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background:
      repeating-linear-gradient(120deg, color-mix(in srgb, var(--accent) 14%, transparent) 0 2px, transparent 2px 18px),
      radial-gradient(circle at 12% 10%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 52%),
      radial-gradient(circle at 92% 84%, color-mix(in srgb, var(--hero-c) 24%, transparent), transparent 44%);
  }

  .hero {
    margin-top: clamp(1rem, 2.8vw, 1.6rem);
  }

  .archive-head {
    display: grid;
    gap: 0.45rem;
    margin-bottom: 1rem;
  }

  .kicker {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.74rem;
    color: var(--muted);
    font-weight: 700;
  }

  h1,
  .hero-title {
    margin: 0.4rem 0 0.55rem;
    font-size: clamp(2.1rem, 8vw, 5.2rem);
    line-height: 0.98;
    text-wrap: balance;
    letter-spacing: 0.014em;
  }

  .selector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 0.8rem;
  }

  .selector-card {
    display: grid;
    gap: 1rem;
    text-align: left;
    padding: 1rem;
    border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--line));
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--surface-solid) 92%, transparent), color-mix(in srgb, var(--bg) 90%, transparent)),
      repeating-linear-gradient(-45deg, color-mix(in srgb, var(--accent) 9%, transparent) 0 12px, transparent 12px 32px);
    color: inherit;
    cursor: pointer;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .selector-card:hover,
  .selector-card.selected {
    transform: translateY(-3px);
    border-color: color-mix(in srgb, var(--accent) 72%, var(--line));
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--accent) 16%, var(--surface-solid)), color-mix(in srgb, var(--bg) 92%, transparent)),
      repeating-linear-gradient(-45deg, color-mix(in srgb, var(--accent) 16%, transparent) 0 12px, transparent 12px 32px);
  }

  .selector-number {
    font-family: 'Anton', 'Arial Black', Impact, sans-serif;
    font-size: clamp(1.6rem, 6vw, 3.5rem);
    color: color-mix(in srgb, var(--accent) 76%, var(--text));
    line-height: 0.9;
  }

  .selector-copy {
    display: grid;
    gap: 0.4rem;
  }

  .selector-copy p,
  .selector-footer span {
    margin: 0;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }

  .selector-copy h2 {
    margin: 0;
    font-size: clamp(1.2rem, 3.2vw, 2.1rem);
    line-height: 1;
  }

  .selector-excerpt {
    font-size: 0.94rem;
    line-height: 1.55;
    text-transform: none;
    letter-spacing: 0;
    color: color-mix(in srgb, var(--text) 90%, transparent);
  }

  .selector-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
    padding-top: 0.8rem;
    border-top: 1px solid color-mix(in srgb, var(--line) 76%, transparent);
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

  .writing-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.8rem;
    border-bottom: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
    padding-bottom: 0.5rem;
    margin-bottom: 0.15rem;
  }

  .writing-head h2,
  .gallery h2 {
    margin: 0;
    font-size: clamp(1.1rem, 2.2vw, 1.7rem);
    letter-spacing: 0.02em;
  }

  .writing-head p,
  .gallery-head p {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
  }

  .writing > p {
    margin: 0;
    max-width: 88ch;
    line-height: 1.82;
    font-size: clamp(0.94rem, 1.4vw, 1.03rem);
    color: color-mix(in srgb, var(--text) 92%, transparent);
  }

  .collab-artists {
    margin-top: clamp(1.2rem, 3vw, 2.1rem);
  }

  .collab-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.8rem;
    border-bottom: 2px solid color-mix(in srgb, var(--accent) 62%, var(--line));
    padding-bottom: 0.5rem;
    margin-bottom: 0.85rem;
  }

  .collab-head h2 {
    margin: 0;
    font-size: clamp(1.1rem, 2.2vw, 1.7rem);
    letter-spacing: 0.02em;
  }

  .collab-head p {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
  }

  .collab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.7rem;
  }

  .collab-card {
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

  .collab-card:hover {
    transform: translateY(-2px);
    border-top-color: color-mix(in srgb, var(--accent) 70%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 86%, transparent);
  }

  .collab-role {
    margin: 0;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-weight: 700;
  }

  .collab-name {
    margin: 0;
    font-size: clamp(1.1rem, 2.6vw, 1.8rem);
    line-height: 1;
    letter-spacing: 0.01em;
  }

  .collab-desc {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.7;
    color: color-mix(in srgb, var(--text) 88%, transparent);
    padding-top: 0.35rem;
    border-top: 1px solid color-mix(in srgb, var(--line) 55%, transparent);
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

    .archive-index,
    .hero {
      padding: 0.85rem;
    }

    .selector-grid {
      grid-template-columns: 1fr;
    }

    .selector-card {
      gap: 0.8rem;
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

    .writing-head,
    .gallery-head {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.35rem;
    }

    .masonry {
      columns: 2 160px;
      column-gap: 0.55rem;
    }

    .shot {
      margin-bottom: 0.55rem;
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
