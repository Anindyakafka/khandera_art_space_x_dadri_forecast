import { a8 as ensure_array_like, e as escape_html, a7 as attr } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let projects = [];
    $$renderer2.push(`<section class="section"><h1>Projects</h1> <div class="grid svelte-rqn88j"><!--[-->`);
    const each_array = ensure_array_like(projects);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let project = each_array[$$index];
      $$renderer2.push(`<article class="project-card svelte-rqn88j"><h2>${escape_html(project.title)}</h2> <p>${escape_html(project.excerpt)}</p> <p><strong>${escape_html(project.year)}</strong> • ${escape_html(project.tags.join(", "))}</p> `);
      if (project.liveUrl) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a class="cta svelte-rqn88j"${attr("href", project.liveUrl)} target="_blank" rel="noopener noreferrer">Explore</a>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></article>`);
    }
    $$renderer2.push(`<!--]--></div></section>`);
  });
}
export {
  _page as default
};
