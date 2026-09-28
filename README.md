# Time Zone Offset Formatter

Formats a UTC offset given in total minutes into ISO 8601 extended form (`±HH:MM`), e.g. `+08:00` or `-05:30`.

## Usage

```js
import { formatOffset } from './src/index.js';

formatOffset(480);   // "+08:00"
formatOffset(-330);  // "-05:30"
formatOffset(0);     // "+00:00"
```

## Why this exists

Most date libraries bury offset formatting inside a much larger API surface. When all you need is to turn a signed minute count into the `±HH:MM` string that ISO 8601 specifies, pulling in a full time-zone library is overkill. This module does exactly that conversion and nothing else.

The trade-off: the input is a raw minute count, not an IANA zone name. If you need to resolve a zone name to an offset at a particular instant, do that upstream and hand the resulting minutes here.

## Edge cases

- Zero is rendered as `+00:00`, never `-00:00` or `Z`. The brief asks for the explicit `±HH:MM` form.
- Fractional minutes are rejected with a `TypeError`. ISO 8601 offsets have minute granularity; accepting fractions would force a rounding decision we would rather not make silently.
- Offsets whose hour magnitude exceeds 23 are supported and rendered without truncation (`+25:00`). ISO 8601 does not cap the hour field, and a formatter that silently dropped data is worse than one that faithfully represents its input. Hour magnitudes of 100 or more will render with more than two digits (`+100:00`).
- Non-finite numbers (`NaN`, `Infinity`, `-Infinity`) and non-number inputs are rejected with a `TypeError`.

## API

### `formatOffset(totalMinutes: number): string`

- **`totalMinutes`** — a finite integer. Positive is east of UTC, negative is west.
- **Returns** — the offset in ISO 8601 extended form.
- **Throws** — `TypeError` if the input is not a finite integer.
