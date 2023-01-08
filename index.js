import { visit } from "unist-util-visit";

const RE_SCRIPT_START =
  /<script(?:\s+?[a-zA-z]+(=(?:["']){0,1}[a-zA-Z0-9]+(?:["']){0,1}){0,1})*\s*?>/;

export default function remarkExcerpt(options = {}) {
  const {
    componentName = "More",
    componentPath = "$lib/components/More.svelte",
    excerptMark = "<!--more-->",
  } = options;

  const importMore = `\nimport ${componentName} from "${componentPath}";\n`;

  return function transform(tree) {
    let foundExcerptTerminator = false;

    /**
     * @param {import('unist').Node} node
     */
    function visitor(node) {
      if (
        foundExcerptTerminator ||
        node.type !== "html" ||
        node.value !== excerptMark
      ) {
        return;
      }

      foundExcerptTerminator = true;
      node.value = `<${componentName}>`;
    }

    // find and replace <!--more-->
    visit(tree, ["html"], visitor);

    if (!foundExcerptTerminator) {
      return;
    }

    tree.children.push({
      type: "html",
      value: `</${componentName}>`,
    });

    let is_script = false;

    // append scripts or make a new one
    visit(tree, "html", (node) => {
      if (!is_script && RE_SCRIPT_START.test(node.value)) {
        is_script = true;
        node.value = node.value.replace(RE_SCRIPT_START, (existingScript) => {
          return `${existingScript}${importMore}`;
        });
      }
    });

    if (!is_script) {
      tree.children.push({
        type: "html",
        value: `<script>${importMore}</script>`,
      });
    }
  };
}
