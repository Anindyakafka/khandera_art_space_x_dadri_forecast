

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BxnlKtkB.js","_app/immutable/chunks/DsCymvJF.js","_app/immutable/chunks/BpScA_Ru.js","_app/immutable/chunks/PxGbc3C8.js"];
export const stylesheets = ["_app/immutable/assets/3.B2K82s1c.css"];
export const fonts = [];
