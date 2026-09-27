/**
 * Formats a UTC offset (given in total minutes east of UTC) into the ISO 8601
 * extended form `±HH:MM`.
 *
 * Design decisions, stated plainly so the tests can hold us to them:
 *
 * 1. Input unit is minutes, not seconds or milliseconds. The brief says minutes.
 *    We do not accept fractional minutes; passing 5.5 is a TypeError. This keeps
 *    the output format unambiguous — ISO 8601 offsets have minute granularity.
 *
 * 2. The sign of the output follows the sign of the input. A negative input
 *    produces `-HH:MM`; a positive input produces `+HH:MM`. Zero is rendered as
 *    `+00:00` (ISO 8601 permits `Z` for UTC, but the brief asks for the
 *    `±HH:MM` form, so we always use the explicit form).
 *
 * 3. We support offsets whose hour magnitude exceeds 23. Real-world IANA time
 *    zones currently stay within ±14:00, but ISO 8601 itself does not cap the
 *    hour field at 24, and there is no reason for a formatter to reject values
 *    the spec allows. We do, however, cap the hour field at two digits of width
 *    via zero-padding only up to 2; values with |hours| >= 100 will render with
 *    more than two digits (e.g. +100:00). This matches what most parsers that
 *    accept unbounded offsets do, and avoids silently truncating data.
 *
 * 4. Non-finite numbers (NaN, Infinity, -Infinity) are rejected with a
 *    TypeError. They have no meaningful offset representation.
 *
 * 5. Non-number inputs are rejected with a TypeError rather than coerced.
 *    Silent coercion is where formatting libraries hide bugs.
 *
 * @param {number} totalMinutes - Offset from UTC in minutes. Must be a finite
 *   integer. Positive is east of UTC, negative is west.
 * @returns {string} The offset in ISO 8601 extended form, e.g. `+08:00`,
 *   `-05:30`, `+00:00`.
 * @throws {TypeError} If `totalMinutes` is not a finite integer.
 */
export function formatOffset(totalMinutes) {
  if (typeof totalMinutes !== 'number' || !Number.isFinite(totalMinutes)) {
    throw new TypeError(
      `formatOffset expected a finite integer number of minutes, got ${String(totalMinutes)}`
    );
  }
  if (!Number.isInteger(totalMinutes)) {
    throw new TypeError(
      `formatOffset expected an integer number of minutes, got ${totalMinutes}`
    );
  }

  // Work with the absolute value for formatting, then re-apply the sign.
  // Zero is treated as positive so we never emit "-00:00".
  const sign = totalMinutes < 0 ? '-' : '+';
  const absMinutes = Math.abs(totalMinutes);

  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  // padStart(2, '0') handles the common case (hours 0..23 → two digits) and
  // also does the right thing for larger magnitudes: 100 stays "100".
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');

  return `${sign}${hh}:${mm}`;
}
