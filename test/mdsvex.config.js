import { defineMDSveXConfig as defineConfig } from "mdsvex";
import remarkExcerpt from "mdsvex-excerpt";

const config = defineConfig({
  extensions: [".svelte.md", ".md", ".svx"],
  remarkPlugins: [
    [
      remarkExcerpt,
      {
        componentPath: "$lib/More.svelte",
      },
    ],
  ],
});

export default config;
