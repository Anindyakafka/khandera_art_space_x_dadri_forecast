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
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .artist-card {
    background: rgba(10, 5, 26, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.8rem;
    padding: 1rem;
  }

  .artist-card img {
    width: 100%;
    border-radius: 0.6rem;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  .role {
    margin-top: .2rem;
    color: #b8b3cc;
  }
</style>