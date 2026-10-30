import hljs from "highlight.js/lib/core";
import MarkdownIt from "markdown-it";
import { codeLanguages } from "./code-languages";

for (const [name, language] of Object.entries(codeLanguages)) hljs.registerLanguage(name, language);

// Raw HTML is disabled, so the output is safe to render with v-html. highlight.js escapes the
// code it colours, and returning "" leaves markdown-it to escape any other language itself.
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  highlight: (code, language) => (hljs.getLanguage(language) ? hljs.highlight(code, { language, ignoreIllegals: true }).value : ""),
});

const renderLink =
  md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!;
  if (/^https?:\/\//i.test(String(token.attrGet("href") ?? ""))) {
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noopener noreferrer nofollow");
  }
  return renderLink(tokens, idx, options, env, self);
};

const renderImage = md.renderer.rules.image!;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx]!.attrSet("loading", "lazy");
  return renderImage(tokens, idx, options, env, self);
};

export function renderMarkdown(source: string) {
  return md.render(source);
}
