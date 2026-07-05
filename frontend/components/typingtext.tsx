'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  speed?: number;
}

export default function TypingText({
  text,
  speed = 18,
}: TypingTextProps) {

  const [displayedText, setDisplayedText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    setDisplayedText("");

    let index = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {

      index++;

      setDisplayedText(text.slice(0, index));

      if (index >= text.length) {

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

      }

    }, speed);

    return () => {

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

    };

  }, [text, speed]);

  return (

    <div className="flex items-center">

      <span className="whitespace-pre-wrap">
        {displayedText}
      </span>

      <motion.span
        animate={{
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: .9,
          repeat: Infinity,
        }}
        className="ml-1 font-bold text-violet-500"
      >
        ▋
      </motion.span>

    </div>

  );

}