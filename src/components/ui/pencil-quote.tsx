"use client";

import { useEffect, useState } from "react";
import { CODING_QUOTES } from "@/lib/quotes";

export function PencilQuote() {
  const [quote, setQuote] = useState(CODING_QUOTES[0]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time random pick after mount, avoids SSR/client mismatch
    setQuote(CODING_QUOTES[Math.floor(Math.random() * CODING_QUOTES.length)]);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex -rotate-2 items-center justify-center px-6 text-center">
      <p className="font-hand text-xl leading-snug text-text-dim/60">
        {quote}
      </p>
    </div>
  );
}
