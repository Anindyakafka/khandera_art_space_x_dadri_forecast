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
    margin: clamp(2rem, 4.8vw, 4rem) auto;
  }

  h1 {
    margin-bottom: 0.9rem;
    font-size: clamp(1.6rem, 3vw, 2.5rem);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .artist-card {
    background: color-mix(in srgb, var(--surface-solid) 88%, transparent);
    border: 1px solid var(--line);
    border-radius: 0.8rem;
    padding: 1rem;
    box-shadow: 0 16px 34px -30px var(--shadow);
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
</style>