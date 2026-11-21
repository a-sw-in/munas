"use client";

import React from "react";

export default function Button({
  href = "https://www.instagram.com/acid.record",
}: {
  href?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex items-center gap-2 cursor-pointer no-underline text-[#e62626] hover:text-[#ff4444] transition-colors duration-300"
      style={{ color: "#e62626",
        paddingTop: "5rem",
       }}
    >
      <span
        className="font-bold text-[20px] tracking-wider uppercase relative inline-block select-none"
        style={{ color: "inherit" }}
      >
        INSTAGRAM
        {/* Animated underline on hover */}
        <span
          className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#e62626] group-hover:bg-[#ff4444] group-hover:w-full transition-all duration-300 ease-out"
        />
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 transition-transform duration-200 ease-out group-hover:translate-x-1.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        style={{ stroke: "currentColor", color: "inherit" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </a>
  );
}
