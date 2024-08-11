import React from "react";
import StepFlow from "./stepFlow"; // Make sure the path is correct
import ShowContentContainer from "./showContentContainer";

interface CardItem {
  icon: string;
  title: string;
  body?: string;
}

const items: CardItem[] = [
  {
    icon: "🤝",
    title: "Create an event",
    body: "In your Google Calendar.",
  },
  {
    icon: "💌",
    title: "Request feedback",
    body: "Send a note to your team.",
  },
  {
    icon: "💼",
    title: "Improve your comapny",
    body: "See what your team thinks.",
  },
];

const Walkthrough: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-4 text-foreground/70">
      <ShowContentContainer
        className="font-semibold text-4xl md:text-5xl tracking-tight mb-4 md:mb-6 text-center"
        variant="main"
        animate={false}
      >
        <span>Track your meetings</span>
        <span className="text-secondary/50"> Easily</span>
        <br />
        <div className="mt-4" />
        <span>And improve your company</span>
        <span className="text-primary"> Quickly.</span>
      </ShowContentContainer>
      <StepFlow items={items} />
    </div>
  );
};

export default Walkthrough;
