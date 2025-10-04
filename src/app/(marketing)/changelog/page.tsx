import AnimationContainer from "@/components/global/animation-container";
import React from "react";

const ChangeLogPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AnimationContainer delay={0.1}>
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
          OptimAIzer Changelog
        </h1>
        <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
          Stay informed about the latest updates, AI model improvements, and new
          debugging features added to OptimAIzer.
        </p>
      </AnimationContainer>
    </div>
  );
};

export default ChangeLogPage;
