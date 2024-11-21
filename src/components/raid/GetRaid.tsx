import React, { useEffect, useRef } from "react";
import "./GetRaid.css"; // CSS for sparkles and hover effects

const GetRaid = () => {
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Add sparkle effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const link = linkRef.current;
      if (!link) return;

      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;

      link.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000); // Sparkle disappears after 1 second
    }, 3000); // Add a sparkle every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <li>
      <a
        href="https://v2.raydium.io/swap/"
        target="_blank"
        rel="noopener noreferrer"
        ref={linkRef}
        className="get-raid-link"
      >
        #GET RAID
      </a>
    </li>
  );
};

export default GetRaid;
