import { AnimationContainer, MaxWidthWrapper } from "@/components";
import React from "react";

const Privacy = () => {
  return (
    <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
      <AnimationContainer delay={0.1} className="w-full">
        <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
          Privacy Policy
        </h1>
        <p className="text-sm mb-2 italic mt-20">
          Last updated: 5th October 2025
        </p>
        <p className="mt-4">
          At <strong>OptimAIzer</strong>, your privacy is our priority. This
          Privacy Policy explains how we collect, use, and protect your
          information when you use our AI-powered link management services and
          website.
        </p>

        <h2 className="text-xl font-medium mt-8">Information We Collect</h2>

        <h3 className="text-lg mt-4">Personal Information</h3>
        <p className="mt-4 text-muted-foreground">
          When you create an account or use OptimAIzer services, we may collect
          personal information that identifies you, such as your name, email
          address, and payment details.
        </p>

        <h3 className="text-lg font-medium mt-8">Non-Personal Information</h3>
        <p className="mt-4 text-muted-foreground">
          We may also collect information about your usage of our services,
          including IP addresses, browser types, device information, and
          interaction data to optimize your experience.
        </p>

        <h3 className="text-lg font-medium mt-8">Cookies and Tracking</h3>
        <p className="mt-4 text-muted-foreground">
          We use cookies and similar technologies to enhance your experience,
          analyze usage, and deliver personalized features. You can manage your
          cookie preferences via your browser settings.
        </p>

        <h2 className="text-xl font-medium mt-12">
          How We Use Your Information
        </h2>

        <h3 className="text-lg mt-4">Service Delivery &amp; Optimization</h3>
        <ul className="list-disc ml-8 mt-4 text-muted-foreground">
          <li>Provide and maintain our AI-powered link management services.</li>
          <li>Improve and personalize your experience on OptimAIzer.</li>
          <li>Process transactions and manage your account securely.</li>
        </ul>

        <h3 className="text-lg mt-8">Communication</h3>
        <ul className="list-disc ml-8 mt-4 text-muted-foreground">
          <li>Send service updates, product news, and promotional content.</li>
          <li>Respond to support requests and customer inquiries.</li>
        </ul>

        <h3 className="text-lg mt-8">Analytics &amp; AI Insights</h3>
        <ul className="list-disc ml-8 mt-4 text-muted-foreground">
          <li>
            Analyze usage patterns to enhance link suggestions and AI features.
          </li>
          <li>
            Conduct research to improve platform performance and user
            experience.
          </li>
        </ul>

        <h2 className="text-xl font-medium mt-12">
          How We Share Your Information
        </h2>

        <h3 className="text-lg mt-4">Service Providers</h3>
        <p className="mt-4 text-muted-foreground">
          We may share your information with trusted third-party providers that
          help operate OptimAIzer, such as payment processors, hosting services,
          and email platforms.
        </p>

        <h3 className="text-lg mt-8">Legal Requirements</h3>
        <p className="mt-4 text-muted-foreground">
          We may disclose your information if required by law, regulation, or
          valid government request.
        </p>

        <h3 className="text-lg mt-8">Business Transfers</h3>
        <p className="mt-4 text-muted-foreground">
          In the event of a merger, acquisition, or sale of assets, your
          information may be transferred to the acquiring entity under the same
          privacy protections.
        </p>

        <h2 className="text-xl font-medium mt-12">Data Security</h2>
        <p className="mt-4 text-muted-foreground">
          We implement appropriate technical and organizational measures to
          safeguard your personal information. However, no method of
          transmission or storage is completely secure.
        </p>

        <h2 className="text-xl font-medium mt-12">Data Retention</h2>
        <p className="mt-4 text-muted-foreground">
          We retain your personal information only as long as necessary to
          provide services, comply with legal obligations, resolve disputes, and
          enforce agreements.
        </p>

        <h2 className="text-xl font-medium mt-12">Your Rights</h2>

        <h3 className="text-lg mt-4">Access &amp; Update</h3>
        <p className="mt-4 text-muted-foreground">
          You can access and update your personal information in your OptimAIzer
          account settings.
        </p>

        <h3 className="text-lg mt-4">Opt-Out</h3>
        <p className="mt-4 text-muted-foreground">
          You can opt out of promotional communications by following the
          unsubscribe link in emails or contacting us directly.
        </p>

        <h3 className="text-lg mt-4">Data Deletion</h3>
        <p className="mt-4 text-muted-foreground">
          You can request deletion of your personal data by emailing us at{" "}
          <strong>support@optimaizer.com</strong>.
        </p>

        <h2 className="text-xl font-medium mt-12">Children&apos;s Privacy</h2>
        <p className="mt-4 text-muted-foreground">
          OptimAIzer is not intended for individuals under 18. We do not
          knowingly collect personal information from children and will delete
          it if discovered.
        </p>

        <h2 className="text-xl font-medium mt-12">
          International Data Transfers
        </h2>
        <p className="mt-4 text-muted-foreground">
          Your information may be transferred internationally. We ensure
          appropriate safeguards are in place to protect your data during such
          transfers.
        </p>

        <h2 className="text-xl font-medium mt-12">
          Changes to This Privacy Policy
        </h2>
        <p className="mt-4 text-muted-foreground">
          We may update this Privacy Policy occasionally. Changes will be posted
          on our website with the updated &quot;Last updated&quot; date.
        </p>

        <h2 className="text-xl font-medium mt-12">Contact Us</h2>
        <p className="mt-4 text-muted-foreground">
          For questions about this Privacy Policy, contact us at{" "}
          <strong>support@optimaizer.com</strong>.
        </p>

        <p className="mt-8 font-medium">
          By using OptimAIzer, you acknowledge that you have read, understood,
          and agree to this Privacy Policy.
        </p>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default Privacy;
