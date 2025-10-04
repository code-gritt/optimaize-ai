import { BarChart3Icon, FolderOpenIcon, WandSparklesIcon } from "lucide-react";

export const DEFAULT_AVATAR_URL =
  "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&backgroundRotation=0,360&seed=";

export const PAGINATION_LIMIT = 10;

export const COMPANIES = [
  {
    name: "Vercel",
    logo: "/assets/company-01.svg",
  },
  {
    name: "Notion",
    logo: "/assets/company-02.svg",
  },
  {
    name: "OpenAI",
    logo: "/assets/company-03.svg",
  },
  {
    name: "Linear",
    logo: "/assets/company-04.svg",
  },
  {
    name: "Raycast",
    logo: "/assets/company-05.svg",
  },
  {
    name: "Replit",
    logo: "/assets/company-06.svg",
  },
] as const;

export const PROCESS = [
  {
    title: "Scan Your Codebase",
    description:
      "Run automated AI code reviews to detect bugs, inefficiencies, and potential vulnerabilities in seconds.",
    icon: FolderOpenIcon,
  },
  {
    title: "Debug with Intelligence",
    description:
      "Use context-aware AI debugging to identify the root cause of issues and get precise, step-by-step fixes.",
    icon: WandSparklesIcon,
  },
  {
    title: "Optimize and Improve",
    description:
      "Gain actionable insights into code quality, performance, and maintainability to continuously improve your software.",
    icon: BarChart3Icon,
  },
] as const;

export const FEATURES = [
  {
    title: "AI-Powered Code Review",
    description:
      "Automatically review pull requests and commits for code smells, logic errors, and security risks.",
  },
  {
    title: "Smart Debugging Assistant",
    description:
      "Leverage AI to trace errors, suggest fixes, and explain stack traces in plain English.",
  },
  {
    title: "Performance Insights",
    description:
      "Receive intelligent recommendations to improve speed, memory usage, and maintainability.",
  },
  {
    title: "Team Collaboration",
    description:
      "Collaborate in real-time with teammates and review AI feedback directly within your repositories.",
  },
  {
    title: "Continuous Integration Support",
    description:
      "Integrate OptimAIzer into CI/CD pipelines for automated code checks and live debugging suggestions.",
  },
  {
    title: "Custom AI Models",
    description:
      "Train OptimAIzer with your project data for tailored code understanding and personalized debugging responses.",
  },
] as const;

export const REVIEWS = [
  {
    name: "Michael Smith",
    username: "@michaelsmith",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    review:
      "OptimAIzer completely changed how my team handles code reviews. The AI catches issues faster than manual reviews ever could!",
  },
  {
    name: "Emily Johnson",
    username: "@emilyjohnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 4,
    review:
      "Super impressive! It’s like having a senior engineer pair-review every commit. A few tweaks needed in performance insights, but overall excellent.",
  },
  {
    name: "Daniel Williams",
    username: "@danielwilliams",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
    review:
      "Our bug backlog dropped by 40% after adopting OptimAIzer. The AI suggestions are contextually accurate and easy to implement.",
  },
  {
    name: "Sophia Brown",
    username: "@sophiabrown",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4,
    review:
      "This platform saves me hours every week. The AI explanations make debugging educational and fast.",
  },
  {
    name: "James Taylor",
    username: "@jamestaylor",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 5,
    review:
      "Incredible tool! The AI reviewer gives actionable, detailed feedback that rivals experienced developers.",
  },
  {
    name: "Olivia Martinez",
    username: "@oliviamartinez",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 4,
    review:
      "OptimAIzer has streamlined our entire review process. Excited for deeper GitHub Actions integration in future updates.",
  },
  {
    name: "William Garcia",
    username: "@williamgarcia",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 5,
    review:
      "This is the future of software development. AI-assisted debugging saves hours of manual code tracing and frustration.",
  },
  {
    name: "Mia Rodriguez",
    username: "@miarodriguez",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 4,
    review:
      "I’ve tried multiple AI code tools — OptimAIzer is by far the most accurate and developer-friendly.",
  },
  {
    name: "Henry Lee",
    username: "@henrylee",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 5,
    review:
      "OptimAIzer caught subtle logic issues that even code linters missed. It’s become an essential part of our workflow.",
  },
] as const;
