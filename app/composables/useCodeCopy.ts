// Adds a "Copy" button to every code block inside a container of rendered markdown.
// Runs after mount, so the server-rendered HTML is untouched.
export function useCodeCopy(container: Ref<HTMLElement | undefined>) {
  onMounted(() => {
    for (const pre of container.value?.querySelectorAll("pre") ?? []) {
      // The button lives beside the <pre>, not inside it, so it stays put when long lines scroll
      const block = document.createElement("div");
      block.className = "code-block";
      pre.replaceWith(block);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(pre.textContent ?? "");
          button.textContent = "Copied";
          button.dataset.copied = "";
        } catch {
          button.textContent = "Copy failed";
        }
        setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.copied;
        }, 2000);
      });
      block.append(pre, button);
    }
  });
}
