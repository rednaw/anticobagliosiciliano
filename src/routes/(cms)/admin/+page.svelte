<script lang="ts">
  import { onMount } from 'svelte';
  import CMS from '@sveltia/cms';
  import { cmsConfig } from '$lib/cms-config';

  onMount(() => {
    void CMS.init({
      config: {
        load_config_file: false,
        ...cmsConfig
      }
    });
  });
</script>

<div id="nc-root"></div>
