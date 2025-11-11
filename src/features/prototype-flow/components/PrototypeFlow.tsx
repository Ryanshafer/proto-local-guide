import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { CommentDeck } from "@/features/comments";
import { ProfilePreviewCard } from "@/features/profile";

export type PrototypeStepId = "comment" | "profile-next" | "profile-ryan";

type StepDefinition = {
  id: PrototypeStepId;
  title: string;
  description: string;
  render: () => React.ReactNode;
};

const steps: StepDefinition[] = [
  {
    id: "comment",
    title: "Warning — Comment Missing",
    description: "Replicates the Figma warning dialogue design.",
    render: () => <CommentDeck />,
  },
  {
    id: "profile-next",
    title: "Profile Preview — Next.js",
    description: "Hover-card style profile preview with navigation controls.",
    render: () => (
      <PrototypeFlowCardWrapper>
        <ProfilePreviewCard
          handle="@nextjs"
          description="The React Framework - created and maintained by @vercel"
        />
      </PrototypeFlowCardWrapper>
    ),
  },
  {
    id: "profile-ryan",
    title: "Profile Preview — ryanshafer",
    description: "Alternate profile copy to compare card variants.",
    render: () => (
      <PrototypeFlowCardWrapper>
        <ProfilePreviewCard
          handle="@ryanshafer"
          description="The new, fast method of prototyping in 2025"
        />
      </PrototypeFlowCardWrapper>
    ),
  },
];

const stepIndexMap = steps.reduce<Record<PrototypeStepId, number>>((acc, step, index) => {
  acc[step.id] = index;
  return acc;
}, {} as Record<PrototypeStepId, number>);

const stepVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction === 1 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction === 1 ? -48 : 48,
    opacity: 0,
  }),
};

const PrototypeFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState<PrototypeStepId>("comment");
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const activeIndex = stepIndexMap[currentStep];
  const activeStep = steps[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === steps.length - 1;
  const regionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    regionRef.current?.focus();
  }, [activeStep]);

  const goNext = React.useCallback(() => {
    if (!isLast) {
      setDirection(1);
      setCurrentStep(steps[activeIndex + 1].id);
    }
  }, [activeIndex, isLast]);

  const goPrev = React.useCallback(() => {
    if (!isFirst) {
      setDirection(-1);
      setCurrentStep(steps[activeIndex - 1].id);
    }
  }, [activeIndex, isFirst]);

  return (
    <section className="flex min-h-dvh flex-col gap-12 px-page pb-page pt-20">
      <div
        ref={regionRef}
        tabIndex={-1}
        aria-live="polite"
        className="mx-auto flex w-full max-w-3xl flex-col gap-8 focus:outline-none"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={activeStep.id}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex w-full flex-col gap-8"
          >
            {activeStep.render()}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav
        aria-label="Prototype navigation"
        className="mx-auto flex w-full max-w-3xl items-center justify-between border-t border-border/70 pt-6"
      >
        <Button variant="outline" size="lg" onClick={goPrev} disabled={isFirst}>
          ← Back
        </Button>
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <span>{activeIndex + 1}</span>
          <span className="sr-only">of</span>
          <span aria-hidden="true">/</span>
          <span>{steps.length}</span>
        </div>
        <Button size="lg" onClick={goNext} disabled={isLast}>
          {isLast ? "End of flow" : "Next step →"}
        </Button>
      </nav>
    </section>
  );
};

const PrototypeFlowCardWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="flex w-full flex-col items-center gap-8">{children}</div>;
};

export default PrototypeFlow;
