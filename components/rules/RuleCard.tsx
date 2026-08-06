"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

interface RuleCardProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export default function RuleCard({
  title,
  content,
  defaultOpen = false,
}: Readonly<RuleCardProps>) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={defaultOpen ? "rule" : undefined}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        backdrop-blur-xl
      "
    >
      <Accordion.Item value="rule">

        <Accordion.Header>

          <Accordion.Trigger
            className="
              group
              flex
              w-full
              items-center
              justify-between
              px-8
              py-6
              text-left
              transition-colors
              hover:bg-white/[0.03]
            "
          >
            <span className="text-xl font-bold text-white">
              {title}
            </span>

            <ChevronDown
              className="
                h-6
                w-6
                text-amber-400
                transition-transform
                duration-300
                group-data-[state=open]:rotate-180
              "
            />
          </Accordion.Trigger>

        </Accordion.Header>

        <Accordion.Content
          className="
            overflow-hidden
            data-[state=closed]:animate-accordion-up
            data-[state=open]:animate-accordion-down
          "
        >
          <div className="border-t border-white/10 px-8 py-6">

            <div className="prose prose-invert max-w-none text-slate-300">
              {content}
            </div>

          </div>

        </Accordion.Content>

      </Accordion.Item>

    </Accordion.Root>
  );
}