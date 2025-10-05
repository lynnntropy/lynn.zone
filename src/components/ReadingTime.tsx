import type * as React from "react";

export interface ReadingTimeProps {
  minutes: number;
}

const ReadingTime: React.FC<ReadingTimeProps> = ({ minutes }) => {
  const coffeeCount = Math.max(1, Math.floor(minutes / 5));

  return (
    <>
      {new Array(coffeeCount).fill(0).map(() => "☕")} {Math.floor(minutes)} min
      read
    </>
  );
};

export default ReadingTime;
