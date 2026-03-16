

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BRttd7nh.js","_app/immutable/chunks/AwpZ848c.js","_app/immutable/chunks/DG77EOL1.js","_app/immutable/chunks/D9F09_zm.js"];
export const stylesheets = ["_app/immutable/assets/3.B2K82s1c.css"];
export const fonts = [];
