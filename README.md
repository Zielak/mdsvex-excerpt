# mdsvex-excerpt

Allows you to show only a portion of document in certain layouts.

Add `<!--more-->` in your MarkDown document to indicate where the excerpt should end. Create your own `<More />` svelte component to control how to render it.

Example implementation is present in `test` directory.

## Install

```
npm install mdsvex-excerpt
```

Add the plugin to your mdsvex config

```js
// mdsvex.config.js
import remarkExcerpt from "mdsvex-excerpt";

export default {
  // ... rest of your config
  remarkPlugins: [remarkExcerpt],
};
```

## Add to MarkDown

Add where the excerpt should end in MarkDown:

```md
# Title

Here's the excerpt, presented at a blog posts listing.

<!--more-->

And this will only be seen when you open this blog post.
```

Under the hood it will be transformed into:

```md
# Title

Here's the excerpt, presented at a blog posts listing.

<More>
And this will only be seen when you open this blog post.
</More>

<script>
import More from "$lib/components/More.svelte";
</script>
```

## Create `<More>` component

Notice the use of `<More>` component, which is imported from your local [`"$lib"` directory](https://kit.svelte.dev/docs/modules#$lib). This plugin expects you to create your own for higher control, so here's a template:

```svelte
// $lib/components/More.svelte
<script lang="ts">
  import { getContext } from 'svelte';

  const onlyExcerpt = getContext('SHOW_ONLY_EXCERPT');
</script>

{#if !onlyExcerpt}
  <slot />
{/if}
```

## Set context

In a layout/page where you want to show only excerpts of documents (eg. listing of all blog posts), set the context:

```svelte
// src/routes/blog/+page.svelte
<script lang="typescript">
  import { setContext } from 'svelte';

  setContext('SHOW_ONLY_EXCERPT', true);
</script>

// ...
```

## Options

```js
// mdsvex.config.js
import remarkExcerpt from "mdsvex-excerpt";

export default {
  // ... rest of your config
  remarkPlugins: [
    [
      remarkExcerpt,
      {
        componentName: "More",
        componentPath: "$lib/components/More.svelte",
        excerptMark: "<!--more-->",
      },
    ],
  ],
};
```

This plugin expects you to create your own `<More>` component. Modify its expected name with `componentName` and path with `componentPath`.

You can use a default HTML comment `<!--more-->` to mark where excerpt ends. Modify it with `excerptMark` option. `excerptMark` will always be replaced with beginning of `<More>` component.

## Compatibility

_Should_ be compatible with other remark/rehype plugins on MDsveX which modify existing `<script>` elements.

Compatible with `mdsvex-relative-images`, which also modifies `<script>` elements if already present in a document.
