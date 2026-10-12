import { Fragment } from "react";

const NUMBER_PATTERN = /\b\d[\d,]*\+?/g;

/**
 * Renders text with embedded figures (150+, 40, 8, 500,000+, ...)
 * styled as standout numerals. A single implementation reused across
 * every achievement bullet, so measurable results read as data points
 * rather than being buried in prose, without duplicating the numbers
 * anywhere in the data layer.
 */
export function HighlightNumbers({ text }: { text: string }) {
  const parts = text.split(NUMBER_PATTERN);
  const matches = text.match(NUMBER_PATTERN) ?? [];

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {matches[index] && <span className="font-display font-semibold text-link tabular-nums">{matches[index]}</span>}
        </Fragment>
      ))}
    </>
  );
}
