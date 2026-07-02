"use client";

import { Fragment, useEffect, useRef } from "react";
import { registerWord, unregisterWord } from "@/lib/word-physics";
import { cn } from "@/lib/utils";

export type KnockableToken =
  | { text: string; className?: string; join?: boolean }
  | { break: true };

function letterStartOffsets(tokens: KnockableToken[]): number[] {
  return tokens.reduce<{ list: number[]; count: number }>(
    (acc, token) => {
      if ("break" in token) return { list: [...acc.list, -1], count: acc.count };
      return { list: [...acc.list, acc.count], count: acc.count + token.text.length };
    },
    { list: [], count: 0 }
  ).list;
}

function flattenLetters(tokens: KnockableToken[]) {
  const letters: { char: string; className?: string }[] = [];
  tokens.forEach((token) => {
    if ("break" in token) return;
    for (const char of token.text) {
      letters.push({ char, className: token.className });
    }
  });
  return letters;
}

export function KnockableWords({
  tokens,
  as = "span",
  wordClassName,
  className,
}: {
  tokens: KnockableToken[];
  as?: "span" | "h1";
  wordClassName?: string;
  className?: string;
}) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const letters = flattenLetters(tokens);
    const ids = letters.map((letter, i) => {
      const el = letterRefs.current[i];
      if (!el) return -1;
      return registerWord(el, {
        text: letter.char,
        className: cn(wordClassName, letter.className),
      });
    });
    return () => {
      ids.forEach((id) => {
        if (id !== -1) unregisterWord(id);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tokens/wordClassName are fixed per instance
  }, []);

  const offsets = letterStartOffsets(tokens);
  const content = tokens.map((token, i) => {
    if ("break" in token) return <br key={i} />;
    const base = offsets[i];
    const chars = [...token.text];
    return (
      <Fragment key={i}>
        {i > 0 && !token.join && " "}
        <span className="inline-block whitespace-nowrap">
          {chars.map((char, charI) => {
            const idx = base + charI;
            return (
              <span
                key={charI}
                ref={(el) => {
                  letterRefs.current[idx] = el;
                }}
                className={cn("relative inline-block", wordClassName, token.className)}
              >
                {char}
              </span>
            );
          })}
        </span>
      </Fragment>
    );
  });

  if (as === "h1") {
    return <h1 className={className}>{content}</h1>;
  }

  return <span className={className}>{content}</span>;
}
