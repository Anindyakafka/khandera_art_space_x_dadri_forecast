import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const workspaceRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: [workspaceRoot]
    }
  }
});
