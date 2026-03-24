<script lang="ts">
  import type { ProjectContent } from '$lib/content/types';

  export let project: ProjectContent;
</script>

<article class="project-card">
  <div class="visual" style="background-image:url('{project.image}')" aria-hidden="true"></div>
  <div class="details">
    <h3>{project.title}</h3>
    <p>{project.excerpt}</p>
    <div class="meta">
      <span>{project.year}</span>
      <span>{project.tags.join(' · ')}</span>
    </div>
    {#if project.liveUrl}
      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Experience</a>
    {/if}
  </div>
</article>

<style>
  .project-card {
    display: grid;
    gap: 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
    background: transparent;
    border-radius: 0;
    overflow: hidden;
    transition: border-color 220ms ease, background-color 220ms ease;
  }

  .project-card:hover {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--line));
    background: color-mix(in srgb, var(--surface-solid) 45%, transparent);
  }

  .visual {
    width: 100%;
    min-height: clamp(148px, 26vw, 188px);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: saturate(1.05) contrast(1.02);
    position: relative;
  }

  .visual::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 30%, color-mix(in srgb, var(--surface-solid) 34%, transparent));
  }

  .details {
    padding: 0.78rem 0.15rem 0.92rem;
  }

  h3 {
    margin: 0 0 0.4rem;
    font-size: clamp(1.02rem, 2.2vw, 1.2rem);
  }

  p {
    margin: 0 0 0.8rem;
    opacity: 0.9;
    font-size: clamp(0.9rem, 1.3vw, 0.98rem);
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    color: var(--muted);
    font-size: clamp(0.74rem, 1.15vw, 0.82rem);
    letter-spacing: 0.01em;
  }

  a {
    margin-top: 0.8rem;
    display: inline-block;
    color: color-mix(in srgb, var(--accent) 86%, var(--text));
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    padding-bottom: 0.1rem;
  }

  @media (max-width: 640px) {
    .details {
      padding: 0.64rem 0 0.8rem;
    }

    .visual {
      min-height: 152px;
    }
  }
</style>