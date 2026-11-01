type BriefRequest = { kind: "project" | "consultation"; service?: string };

// One popup for the whole site. Any button can open it, with a service already chosen.
export function useBrief() {
  const request = useState<BriefRequest | null>("brief", () => null);
  return {
    request,
    open: (kind: BriefRequest["kind"], service?: string) => (request.value = { kind, service }),
    close: () => (request.value = null),
  };
}
