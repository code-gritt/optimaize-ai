import React from "react";
import AnimationContainer from "@/components/global/animation-container";

const EnterprisePage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AnimationContainer delay={0.1}>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
          Enterprise Solutions
        </h1>
        <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
          Empower your engineering teams with enterprise-grade AI code review,
          secure debugging, and performance insights.
          <br className="hidden md:block" />
          Contact us to discuss tailored integrations, private deployments, and
          advanced compliance options.
        </p>
      </AnimationContainer>
    </div>
  );
};

export default EnterprisePage;
