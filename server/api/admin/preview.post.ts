import { z } from "zod";

// Renders markdown with the same renderer the public site uses
export default defineEventHandler(async (event) => {
  const { markdown } = await readValidatedBody(event, z.object({ markdown: z.string().max(100000) }).parse);
  return { html: renderMarkdown(markdown) };
});
