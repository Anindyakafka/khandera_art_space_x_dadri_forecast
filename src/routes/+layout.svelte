<script lang="ts">
  // no client data used here, prerender is handled in +layout.server.ts
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Khandera Art Space</title>
</svelte:head>

<style global>
  @import '../app.css';
</style>

<slot />
