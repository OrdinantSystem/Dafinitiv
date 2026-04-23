"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export function MarkdownPreview({
  className,
  content
}: {
  className?: string;
  content: string;
}) {
  return (
    <div className={cn("llm-markdown", className)}>
      <ReactMarkdown
        components={{
          a: ({ className: anchorClassName, href, ...props }) => (
            <a
              {...props}
              className={cn("font-semibold text-primary underline decoration-primary/30", anchorClassName)}
              href={href}
              rel="noreferrer"
              target="_blank"
            />
          )
        }}
        remarkPlugins={[remarkGfm]}
        skipHtml
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
