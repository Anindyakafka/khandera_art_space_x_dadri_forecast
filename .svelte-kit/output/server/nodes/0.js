import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.BSmA4g7H.js","_app/immutable/chunks/AwpZ848c.js","_app/immutable/chunks/DG77EOL1.js","_app/immutable/chunks/D9F09_zm.js"];
export const stylesheets = ["_app/immutable/assets/0.CxYN-f6G.css"];
export const fonts = [];
