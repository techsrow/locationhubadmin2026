// src/lib/time.ts

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";

  const hour12 =
    hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};