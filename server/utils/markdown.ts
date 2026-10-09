import MarkdownIt from "markdown-it";

// Raw HTML is disabled, so the output is safe to render with v-html.
const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

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
