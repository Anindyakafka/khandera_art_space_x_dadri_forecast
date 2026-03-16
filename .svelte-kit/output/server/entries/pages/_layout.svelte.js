import { h as head, s as slot } from "../../chunks/index.js";
function _layout($$renderer, $$props) {
  head("12qhfyh", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Khandera Art Space</title>`);
    });
    $$renderer2.push(`<meta charset="utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1"/>`);
  });
  $$renderer.push(`<!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]-->`);
}
export {
  _layout as default
};
