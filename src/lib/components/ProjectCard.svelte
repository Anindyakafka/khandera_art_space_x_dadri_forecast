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
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--surface-solid) 92%, transparent);
    border-radius: 1.1rem;
    overflow: hidden;
    box-shadow: 0 16px 38px -30px var(--shadow);
    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--accent) 30%, var(--line));
    box-shadow: 0 24px 48px -30px var(--shadow);
  }

  .visual {
    width: 100%;
    min-height: 188px;
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
    padding: 0.95rem 1rem 1.05rem;
  }

  h3 {
    margin: 0 0 0.4rem;
    font-size: 1.2rem;
  }

  p {
    margin: 0 0 0.8rem;
    opacity: 0.9;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    color: var(--muted);
    font-size: 0.82rem;
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
</style>