<script setup lang="ts">
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { createLowlight } from "lowlight";
import { marked } from "marked";

// Raw HTML shows as literal text on the public site, so it must stay text here too. Parsed as
// HTML, a mention of <div> in a sentence would silently disappear from the post.
marked.use({ tokenizer: { html: () => undefined, tag: () => undefined } });

const model = defineModel<string>({ required: true });
const props = defineProps<{ id: string }>();

// The model only changes when the content is edited, so opening and saving leaves the Markdown as it was
const editor = useEditor({
  content: model.value,
  contentType: "markdown",
  extensions: [
    StarterKit.configure({ codeBlock: false, underline: false, link: { openOnClick: false } }),
    CodeBlockLowlight.configure({ lowlight: createLowlight(codeLanguages) }),
    Markdown.configure({ marked }),
  ],
  editorProps: { attributes: { id: props.id, class: "prose", role: "textbox", "aria-multiline": "true" } },
  onUpdate: ({ editor }) => (model.value = editor.getMarkdown().trimEnd()),
});

const run = () => editor.value!.chain().focus();
const active = (name: string, attributes?: Record<string, unknown>) => editor.value?.isActive(name, attributes) ?? false;

const tools = [
  { label: "Heading 2", icon: "lucide:heading-2", name: "heading", attributes: { level: 2 }, action: () => run().toggleHeading({ level: 2 }).run() },
  { label: "Heading 3", icon: "lucide:heading-3", name: "heading", attributes: { level: 3 }, action: () => run().toggleHeading({ level: 3 }).run() },
  { label: "Bold", icon: "lucide:bold", name: "bold", action: () => run().toggleBold().run() },
  { label: "Italic", icon: "lucide:italic", name: "italic", action: () => run().toggleItalic().run() },
  { label: "Inline code", icon: "lucide:code", name: "code", action: () => run().toggleCode().run() },
  { label: "Link", icon: "lucide:link", name: "link", action: setLink },
  { label: "Bullet list", icon: "lucide:list", name: "bulletList", action: () => run().toggleBulletList().run() },
  { label: "Numbered list", icon: "lucide:list-ordered", name: "orderedList", action: () => run().toggleOrderedList().run() },
  { label: "Quote", icon: "lucide:text-quote", name: "blockquote", action: () => run().toggleBlockquote().run() },
  { label: "Code block", icon: "lucide:square-code", name: "codeBlock", action: () => run().toggleCodeBlock().run() },
];

function setLink() {
  const href = window.prompt("Link URL (leave empty to remove the link)", editor.value!.getAttributes("link").href ?? "");
  if (href === null) return;
  if (href.trim()) run().extendMarkRange("link").setLink({ href: href.trim() }).run();
  else run().extendMarkRange("link").unsetLink().run();
}

const codeLanguage = computed({
  get: () => editor.value?.getAttributes("codeBlock").language ?? "",
  set: (language: string) => run().updateAttributes("codeBlock", { language: language || null }).run(),
});
</script>

<template>
  <div class="rich-editor overflow-hidden rounded-lg border border-line bg-surface focus-within:border-accent">
    <div v-if="editor" class="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-line bg-surface p-1.5" role="toolbar" aria-label="Formatting">
      <button
        v-for="tool in tools"
        :key="tool.label"
        type="button"
        :title="tool.label"
        :aria-label="tool.label"
        :aria-pressed="active(tool.name, tool.attributes)"
        :class="['grid size-9 place-items-center rounded-md transition-colors', active(tool.name, tool.attributes) ? 'bg-raised text-fg' : 'text-muted hover:text-fg']"
        @click="tool.action"
      >
        <Icon :name="tool.icon" size="18" />
      </button>

      <label v-if="active('codeBlock')" class="ml-1 flex items-center gap-2 text-sm text-muted">
        Language
        <select v-model="codeLanguage" class="rounded-md border border-line bg-base px-2 py-1 text-fg">
          <option value="">Plain text</option>
          <option v-for="language in codeLanguageOptions" :key="language.value" :value="language.value">{{ language.label }}</option>
        </select>
      </label>

      <span class="ml-auto flex gap-1">
        <button type="button" title="Undo" aria-label="Undo" class="grid size-9 place-items-center rounded-md text-muted hover:text-fg" @click="run().undo().run()">
          <Icon name="lucide:undo-2" size="18" />
        </button>
        <button type="button" title="Redo" aria-label="Redo" class="grid size-9 place-items-center rounded-md text-muted hover:text-fg" @click="run().redo().run()">
          <Icon name="lucide:redo-2" size="18" />
        </button>
      </span>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
