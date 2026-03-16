<script lang="ts">
  import type { Project } from "$lib/data/content";
  export let project: Project;
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
    gap: 1rem;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(8, 4, 24, 0.6);
    border-radius: 1rem;
    overflow: hidden;
    transition: transform 220ms ease, box-shadow 220ms ease;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 45px rgba(0, 0, 0, 0.45);
  }

  .visual {
    width: 100%;
    min-height: 170px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: saturate(1.2) contrast(1.1);
  }

  .details {
    padding: 1rem;
  }

  h3 {
    margin: 0 0 .4rem;
  }

  p {
    margin: 0 0 .8rem;
    opacity: .9;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    color: #b5b5ff;
    font-size: .85rem;
  }

  a {
    margin-top: .8rem;
    display: inline-block;
    color: #f3e7ff;
    font-weight: 700;
    text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.38);
  }
</style>