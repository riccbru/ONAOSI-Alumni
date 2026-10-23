"use client";

import { useState } from "react";

export function Avatar({
  src,
  firstName,
  lastName,
  size = 56,
  teamLeader = false,
}: {
  src: string;
  firstName: string;
  lastName: string;
  size?: number;
  teamLeader?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const valid = src && /^https?:\/\//.test(src);

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 font-semibold text-primary-800"
      style={{
        width: size,
        height: size,
        boxShadow: teamLeader
          ? "0 0 0 2px #65dde0, 0 0 0 4px rgba(101,221,224,0.25)"
          : "0 0 0 1px rgba(0,38,77,0.08)",
      }}
    >
      {valid && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span style={{ fontSize: size * 0.36 }}>{initials}</span>
      )}
    </span>
  );
}
