import { AnimationContainer, MaxWidthWrapper } from "@/components";
import Link from "next/link";

const TermsPage = () => {
  return (
    <MaxWidthWrapper className="max-w-3xl mx-auto px-8 mb-40">
      <AnimationContainer delay={0.1} className="w-full">
        <h1 className="text-4xl md:text-6xl font-heading font-bold my-12 text-center w-full">
          Terms and Conditions
        </h1>
        <p className="text-sm mb-2 italic mt-20">
          Last updated: 5th October 2025
        </p>
        <p className="mt-4">
          Welcome to <strong>OptimAIzer</strong>. These terms and conditions
          govern your use of our website and AI-powered link management
          services.
        </p>

        <h2 className="text-xl font-medium mt-8">Acceptance of Terms</h2>
        <p className="mt-8 text-muted-foreground">
          By accessing or using OptimAIzer, you agree to be bound by these
          terms. If you do not agree, you may not use our services.
        </p>

        <h2 className="text-xl font-medium mt-12">Changes to Terms</h2>
        <p className="mt-8 text-muted-foreground">
          OptimAIzer may modify these terms at any time. Updated terms will be
          posted with a new &quot;Last updated&quot; date. Continued use of our
          services indicates acceptance of the updated terms.
        </p>

        <h2 className="text-xl font-medium mt-12">Use of Services</h2>

        <h3 className="text-lg mt-8">Eligibility</h3>
        <p className="mt-8 text-muted-foreground">
          You must be at least 18 years old and legally capable of entering into
          binding agreements to use OptimAIzer.
        </p>

        <h3 className="text-lg mt-8">Account Registration</h3>
        <ul className="list-disc ml-8 mt-4 text-muted-foreground">
          <li>
            Provide accurate and complete information during registration.
          </li>
          <li>Maintain the confidentiality of your account credentials.</li>
          <li>Notify us immediately of any unauthorized account activity.</li>
        </ul>

        <h3 className="text-lg mt-8">Acceptable Use</h3>
        <p className="mt-4 text-muted-foreground">
          You agree not to use OptimAIzer for illegal or harmful activities,
          including:
        </p>
        <ul className="list-disc ml-8 mt-4 text-muted-foreground">
          <li>Sharing offensive, harmful, or unlawful content.</li>
          <li>Sending spam or malicious content.</li>
          <li>
            Attempting unauthorized access to other accounts or OptimAIzer
            systems.
          </li>
        </ul>

        <h2 className="text-xl font-medium mt-12">
          Link Shortening and Management
        </h2>

        <h3 className="text-lg mt-8">URL Shortening</h3>
        <p className="mt-4 text-muted-foreground">
          OptimAIzer provides a URL shortening service. You agree not to create
          links to illegal, harmful, or malicious content.
        </p>

        <h3 className="text-lg mt-8">Analytics</h3>
        <p className="mt-4 text-muted-foreground">
          Our analytics tools provide insights on link performance. Use this
          data responsibly and in compliance with privacy laws.
        </p>

        <h3 className="text-lg mt-8">QR Code Generation</h3>
        <p className="mt-4 text-muted-foreground">
          You may generate QR codes for your shortened links. QR codes must not
          be used for malicious purposes.
        </p>

        <h3 className="text-lg mt-8">Business Transfers</h3>
        <p className="mt-4 text-muted-foreground">
          In a merger, acquisition, or sale of assets, your data may be
          transferred to the new entity while maintaining privacy protections.
        </p>

        <h2 className="text-xl font-medium mt-12">User Content</h2>

        <h3 className="text-lg mt-8">Ownership</h3>
        <p className="mt-4 text-muted-foreground">
          You retain ownership of content you upload or create. By using
          OptimAIzer, you grant us a worldwide, non-exclusive, royalty-free
          license to use content as necessary to provide services.
        </p>

        <h2 className="text-xl font-medium mt-12">Responsibility</h2>
        <p className="mt-4 text-muted-foreground">
          You are responsible for the content you create or share. OptimAIzer
          does not endorse or assume liability for user content.
        </p>

        <h2 className="text-xl font-medium mt-12">Privacy</h2>
        <p className="mt-4 text-muted-foreground">
          Your privacy is important. See our{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>{" "}
          for details on how we handle your information.
        </p>

        <h2 className="text-xl font-medium mt-12">Termination</h2>
        <p className="mt-4 text-muted-foreground">
          OptimAIzer may suspend or terminate your account for violations of
          these terms, at its discretion.
        </p>

        <h2 className="text-xl font-medium mt-12">
          Disclaimers &amp; Limitations of Liability
        </h2>

        <h3 className="text-lg mt-8">No Warranties</h3>
        <p className="mt-4 text-muted-foreground">
          OptimAIzer is provided &quot;as is&quot; and &quot;as available&quot;.
          We do not guarantee uninterrupted or error-free service.
        </p>

        <h3 className="text-lg mt-8">Limitation of Liability</h3>
        <p className="mt-4 text-muted-foreground">
          OptimAIzer is not liable for indirect, incidental, or consequential
          damages arising from your use of the service.
        </p>

        <h2 className="text-xl font-medium mt-12">Governing Law</h2>
        <p className="mt-4 text-muted-foreground">
          These terms are governed by the laws of India, without regard to
          conflict of law provisions.
        </p>

        <h2 className="text-xl font-medium mt-12">Contact Us</h2>
        <p className="mt-4 text-muted-foreground">
          For questions regarding these terms, contact us at{" "}
          <strong>support@optimaizer.com</strong>.
        </p>

        <p className="mt-8 font-medium">
          By using OptimAIzer, you agree that you have read, understood, and
          accept these terms and conditions.
        </p>
      </AnimationContainer>
    </MaxWidthWrapper>
  );
};

export default TermsPage;
