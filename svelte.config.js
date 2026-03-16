import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null
    }),
    prerender: {
      default: true
    },
    alias: {
      $lib: 'src/lib'
    }
  }
};

export default config;
