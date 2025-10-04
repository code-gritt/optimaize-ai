import {
  HelpCircleIcon,
  LineChartIcon,
  Link2Icon,
  LockIcon,
  NewspaperIcon,
  QrCodeIcon,
} from "lucide-react";

export const NAV_LINKS = [
  {
    title: "Features",
    href: "/features",
    menu: [
      {
        title: "AI Code Review",
        tagline: "Automatically detect bugs, inefficiencies, and code smells.",
        href: "/features/ai-code-review",
        icon: Link2Icon,
      },
      {
        title: "Secure Debugging",
        tagline:
          "Debug with privacy — your code stays encrypted and protected.",
        href: "/features/secure-debugging",
        icon: LockIcon,
      },
      {
        title: "Performance Analytics",
        tagline:
          "Gain real-time insights into performance and code quality trends.",
        href: "/features/performance-analytics",
        icon: LineChartIcon,
      },
      {
        title: "Smart Suggestions",
        tagline:
          "Get AI-powered recommendations to optimize and refactor your code.",
        href: "/features/smart-suggestions",
        icon: QrCodeIcon,
      },
    ],
  },
  {
    title: "Pricing",
    href: "/pricing",
  },
  {
    title: "Enterprise",
    href: "/enterprise",
  },
  {
    title: "Resources",
    href: "/resources",
    menu: [
      {
        title: "Blog",
        tagline: "Explore insights on AI-driven development and debugging.",
        href: "/resources/blog",
        icon: NewspaperIcon,
      },
      {
        title: "Help Center",
        tagline: "Find answers, guides, and API documentation.",
        href: "/resources/help",
        icon: HelpCircleIcon,
      },
    ],
  },
  {
    title: "Changelog",
    href: "/changelog",
  },
];
