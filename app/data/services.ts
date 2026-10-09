// Services, in display order. `icon` is an Iconify name (lucide:* or simple-icons:*).
// A service whose slug has a scene in ServiceGraphic.vue gets that illustration; others show their icon.
export const services = [
  {
    "slug": "website-development",
    "title": "Website Development",
    "tagline": "Fast, search-friendly websites that turn visitors into customers.",
    "description": "Marketing sites, company websites and content platforms, designed to load quickly, rank well and be easy for your team to update.",
    "icon": "lucide:globe",
    "deliverables": [
      "Responsive design",
      "CMS you can edit yourself",
      "SEO and performance tuning",
      "Hosting and deployment"
    ]
  },
  {
    "slug": "custom-web-apps",
    "title": "Custom Web Applications",
    "tagline": "CRMs, ERPs, dashboards and SaaS products built around how you work.",
    "description": "Business software shaped to your process rather than the other way round: internal tools, client portals, e-commerce platforms and multi-tenant SaaS.",
    "icon": "lucide:layout-dashboard",
    "deliverables": [
      "Requirements and architecture",
      "Backend APIs and database design",
      "Admin dashboards",
      "Third-party integrations"
    ]
  },
  {
    "slug": "mobile-apps",
    "title": "Mobile Apps",
    "tagline": "iOS and Android apps backed by the same solid API as your web product.",
    "description": "Cross-platform mobile apps that share a backend with your web application, so your data and business logic live in one place.",
    "icon": "lucide:smartphone",
    "deliverables": [
      "Cross-platform iOS and Android",
      "Shared API with your web app",
      "Push notifications",
      "App store submission"
    ]
  },
  {
    "slug": "ai-apps",
    "title": "AI Apps & Integration",
    "tagline": "Assistants, automation and AI features wired into your product.",
    "description": "Put large language models to work inside your business: chat assistants over your own data, document processing, workflow automation and AI features inside existing apps.",
    "icon": "lucide:bot",
    "deliverables": [
      "AI chat assistants",
      "Search over your own documents",
      "Workflow automation",
      "AI features in existing apps"
    ]
  }
];
