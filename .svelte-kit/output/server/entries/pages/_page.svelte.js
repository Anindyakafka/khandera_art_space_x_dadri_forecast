import { a3 as fallback, a4 as attr_class, e as escape_html, b as bind_props, a5 as attr_style, a6 as stringify, a7 as attr, a8 as ensure_array_like } from "../../chunks/index.js";
function Hero($$renderer, $$props) {
  let title = fallback($$props["title"], "Khandera Art Space");
  let subtitle = fallback($$props["subtitle"], "Radical collaborative art, performative codes, and venue-less media revolutions.");
  let glitch = false;
  $$renderer.push(`<section class="hero svelte-1q37ri0"><div class="hero-overlay svelte-1q37ri0"></div> <div class="hero-content svelte-1q37ri0"><h1${attr_class("svelte-1q37ri0", void 0, { "glitch": glitch })}>${escape_html(title)}</h1> <p class="svelte-1q37ri0">${escape_html(subtitle)}</p> <a class="cta svelte-1q37ri0" href="#projects">View Radical Projects</a></div></section>`);
  bind_props($$props, { title, subtitle });
}
function ProjectCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let project = $$props["project"];
    $$renderer2.push(`<article class="project-card svelte-oviq8z"><div class="visual svelte-oviq8z"${attr_style(`background-image:url('${stringify(project.image)}')`)} aria-hidden="true"></div> <div class="details svelte-oviq8z"><h3 class="svelte-oviq8z">${escape_html(project.title)}</h3> <p class="svelte-oviq8z">${escape_html(project.excerpt)}</p> <div class="meta svelte-oviq8z"><span>${escape_html(project.year)}</span> <span>${escape_html(project.tags.join(" · "))}</span></div> `);
    if (project.liveUrl) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", project.liveUrl)} target="_blank" rel="noopener noreferrer" class="svelte-oviq8z">Experience</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></article>`);
    bind_props($$props, { project });
  });
}
const projects = [
  {
    id: "p-01",
    title: "Phantom Frequency",
    slug: "phantom-frequency",
    excerpt: "A generative sound sculpture that reconfigures urban memory through spectral color and glitch imagery.",
    image: "/art/phantom-frequency.jpg",
    tags: ["sound", "generative", "installation"],
    liveUrl: "https://example.org/phantom-frequency",
    year: 2025
  },
  {
    id: "p-02",
    title: "Radical Cartography",
    slug: "radical-cartography",
    excerpt: "Tactile map painting collapsing official boundaries into live-action graffiti choreography.",
    image: "/art/radical-cartography.jpg",
    tags: ["street", "politics", "collage"],
    year: 2024
  }
];
function _page($$renderer) {
  $$renderer.push(`<main class="layout svelte-1uha8ag">`);
  Hero($$renderer, {
    title: "Khandera Art Space",
    subtitle: "Radical art as spatial insurgency and collective ritual."
  });
  $$renderer.push(`<!----> <section id="projects" class="section svelte-1uha8ag"><h2 class="svelte-1uha8ag">Current Radical Projects</h2> <p>Each project is a volatile intervention — a snapshot from our ongoing anti-institutional archive.</p> <div class="grid svelte-1uha8ag"><!--[-->`);
  const each_array = ensure_array_like(projects);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let project = each_array[$$index];
    ProjectCard($$renderer, { project });
  }
  $$renderer.push(`<!--]--></div></section> <section class="section svelte-1uha8ag" id="manifesto"><h2 class="svelte-1uha8ag">Manifesto</h2> <p>We are not a gallery. We are a catalyst. We gather in ruins of matter and signal with ephemeral code that refuses the status quo.
      This website is a radical canvas: deep purple, noise, and generative forms that hint at chaos while anchored in intention.</p> <a class="secondary svelte-1uha8ag" href="/about">Read the full intent</a></section></main>`);
}
export {
  _page as default
};
