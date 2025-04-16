import React, { useEffect, useState, useRef } from "react";
import "./intro.css";

const TypingText = ({ text = "", speed = 50, start = false }) => {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef(null);
  const [cursorFadeOut, setCursorFadeOut] = useState(false);

  useEffect(() => {
    if (!start || intervalRef.current) return;

    let index = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => {
        if (index >= text.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setTimeout(() => setCursorFadeOut(true), 3000);

          return prev;
        }
        const nextChar = text.charAt(index);
        index++;
        return prev + nextChar;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [start, text, speed]);

  return (
    <div className="closing-ment-wrap">
      <span className="closing-ment">
        {displayText.split("").map((char, i) => {
          if (char === "\n") return <br key={i} />;
          if (char === " ")
            return (
              <span
                key={i}
                className="fade-char"
                style={{ display: "inline-block", width: "0.5em" }}
              >
                &nbsp;
              </span>
            );
          return (
            <span key={i} className="fade-char">
              {char}
            </span>
          );
        })}
      </span>
      <span
        className={`typing-cursor ${cursorFadeOut ? "fade-out-cursor" : ""}`}
      />
    </div>
  );
};

export default TypingText;
