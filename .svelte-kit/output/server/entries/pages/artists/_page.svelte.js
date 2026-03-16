import { a8 as ensure_array_like, a7 as attr, e as escape_html } from "../../../chunks/index.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let artists = [];
    $$renderer2.push(`<section class="section"><h1>Artists</h1> <div class="grid svelte-1qfpjcv"><!--[-->`);
    const each_array = ensure_array_like(artists);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let artist = each_array[$$index];
      $$renderer2.push(`<article class="artist-card svelte-1qfpjcv"><img${attr("src", artist.avatar)}${attr("alt", artist.name)} loading="lazy" class="svelte-1qfpjcv"/> <h2>${escape_html(artist.name)}</h2> <p class="role svelte-1qfpjcv">${escape_html(artist.role)}</p> <p>${escape_html(artist.bio)}</p> `);
      if (artist.instagram) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<a${attr("href", artist.instagram)} target="_blank" rel="noopener noreferrer">IG</a>`);
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
