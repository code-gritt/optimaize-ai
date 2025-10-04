export const PLANS = [
  {
    name: "Free",
    info: "For individual developers",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { text: "AI code review (basic ruleset)" },
      { text: "Analyze up to 100 files", limit: "100 files" },
      { text: "Syntax and bug detection" },
      { text: "Performance insights", tooltip: "Limited to 50 reports/month" },
      {
        text: "Community support",
        tooltip: "Get help and share tips with other developers on Discord",
      },
      {
        text: "AI optimization tips",
        tooltip: "Receive up to 100 AI-powered improvement suggestions",
      },
    ],
    btn: {
      text: "Start for free",
      href: "/auth/sign-up?plan=free",
      variant: "default",
    },
  },
  {
    name: "Pro",
    info: "For teams and small startups",
    price: {
      monthly: 9,
      yearly: Math.round(9 * 12 * (1 - 0.12)),
    },
    features: [
      { text: "Advanced AI code review" },
      { text: "Analyze up to 1,000 files", limit: "1,000 files" },
      { text: "Automated bug detection & refactoring" },
      { text: "Performance analytics", tooltip: "Up to 500 reports/month" },
      { text: "Export review reports", tooltip: "Up to 1,000 projects" },
      { text: "Priority support", tooltip: "Access 24/7 developer chat" },
      {
        text: "AI optimization tips",
        tooltip: "Get up to 500 AI-powered recommendations",
      },
    ],
    btn: {
      text: "Get started",
      href: "/auth/sign-up?plan=pro",
      variant: "purple",
    },
  },
  {
    name: "Business",
    info: "For engineering organizations",
    price: {
      monthly: 49,
      yearly: Math.round(49 * 12 * (1 - 0.12)),
    },
    features: [
      { text: "Enterprise-grade AI review engine" },
      { text: "Unlimited code analysis" },
      { text: "Deep debugging insights" },
      { text: "Performance & security audits", tooltip: "Unlimited reports" },
      { text: "Export review data", tooltip: "Unlimited projects" },
      {
        text: "Dedicated success manager",
        tooltip: "Priority onboarding and 1:1 technical support",
      },
      {
        text: "AI optimization tips",
        tooltip: "Unlimited AI-powered refactoring and insights",
      },
    ],
    btn: {
      text: "Contact team",
      href: "/auth/sign-up?plan=business",
      variant: "default",
    },
  },
];

export const PRICING_FEATURES = [
  {
    text: "AI code review",
    tooltip: "Automatically detect issues and anti-patterns",
  },
  {
    text: "Performance analytics",
    tooltip: "Measure and improve runtime efficiency",
  },
  {
    text: "Security scanning",
    tooltip: "Identify potential vulnerabilities in your code",
  },
  {
    text: "Up to 10 projects",
    tooltip: "Analyze up to 10 repositories or projects",
  },
  {
    text: "Community support",
    tooltip: "Access the developer community for guidance",
  },
  {
    text: "Priority support",
    tooltip: "Get fast responses from our technical team",
  },
  {
    text: "AI optimization tips",
    tooltip: "Receive AI-powered recommendations to refactor code",
  },
];

export const WORKSPACE_LIMIT = 2;
