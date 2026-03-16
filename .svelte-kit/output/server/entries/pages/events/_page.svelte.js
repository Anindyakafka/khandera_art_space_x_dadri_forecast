import { a8 as ensure_array_like, e as escape_html, a7 as attr } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let events = [];
    $$renderer2.push(`<section class="section"><h1>Events</h1> <div class="grid svelte-13hsgdq"><!--[-->`);
    const each_array = ensure_array_like(events);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let event = each_array[$$index];
      $$renderer2.push(`<article class="event-card svelte-13hsgdq"><h2>${escape_html(event.title)}</h2> <p>${escape_html(new Date(event.date).toLocaleDateString())}</p> <p>${escape_html(event.location)}</p> <p>${escape_html(event.summary)}</p> `);
      if (event.ctaUrl) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a class="cta svelte-13hsgdq"${attr("href", event.ctaUrl)} target="_blank" rel="noopener noreferrer">${escape_html(event.ctaLabel || "More")}</a>`);
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
