import { Metadata } from "next";

interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string | null;
  icons?: Metadata["icons"];
  noIndex?: boolean;
}

export const generateMetadata = ({
  title = `${process.env.NEXT_PUBLIC_APP_NAME} - OptimAIzer | AI-Powered Link Management Platform`,
  description = `${process.env.NEXT_PUBLIC_APP_NAME} is OptimAIzer, the AI-powered platform to manage, brand, and track your links effortlessly.`,
  image = "/thumbnail.png",
  icons = [
    { rel: "apple-touch-icon", sizes: "32x32", url: "/apple-touch-icon.png" },
    { rel: "icon", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "icon", sizes: "16x16", url: "/favicon-16x16.png" },
  ],
  noIndex = false,
}: MetadataOptions = {}): Metadata => {
  return {
    title,
    description,
    icons,
    openGraph: {
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      title,
      description,
      ...(image
        ? { card: "summary_large_image", images: [image] }
        : { card: "summary" }),
      creator: "@OptimAIzerHQ",
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
};
