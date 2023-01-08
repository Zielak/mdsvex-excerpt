<script>
  import { setContext } from 'svelte';
  import Post1 from './post1/+page.md'
  import Post2 from './post2/+page.md'

  setContext('SHOW_ONLY_EXCERPT', true)
</script>

<Post1 />

<Post2 />
