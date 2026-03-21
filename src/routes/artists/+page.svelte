<script lang="ts">
  export let data;
</script>

<section class="section">
  <h1>Artists</h1>
  <div class="grid">
    {#each data.artists as artist}
      <article class="artist-card">
        <img src={artist.avatar} alt={artist.name} loading="lazy" />
        <h2>{artist.name}</h2>
        <p class="role">{artist.role}</p>
        <p>{artist.bio}</p>
        {#if artist.instagram}
          <a href={artist.instagram} target="_blank" rel="noopener noreferrer">IG</a>
        {/if}
      </article>
    {/each}
  </div>
</section>

<style>
  .section {
    max-width: min(1080px, 94vw);
    margin: clamp(1.2rem, 4.2vw, 3.6rem) auto;
  }

  h1 {
    margin-bottom: 0.7rem;
    font-size: clamp(1.45rem, 4.8vw, 2.5rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(0.65rem, 1.8vw, 1rem);
  }

  .artist-card {
    background: transparent;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    padding: clamp(0.72rem, 2.2vw, 1rem);
  }

  .artist-card img {
    width: 100%;
    border-radius: 0.6rem;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  .role {
    margin-top: .2rem;
    color: var(--muted);
  }

  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .artist-card img {
      border-radius: 0.42rem;
      aspect-ratio: 16 / 11;
    }
  }
</style>