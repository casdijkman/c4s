<!--
SPDX-FileCopyrightText: 2024 Cas Dijkman

SPDX-License-Identifier: GPL-3.0-only
-->

# Notes

## To do

- Complete css class examples documentation
- Enable and publish source maps
  See: https://stackoverflow.com/a/38442789
- Rewrite shell scripts to be node scripts (low priority)

### Modules to add

- pointer-events
- forms
  Create easy-to-use default styling for form inputs (text, textarea, checkbox, radio box, button).
  Exclude from default build, create extra build that includes forms
- nested styles (in complex module?)
- transform: rotate
- writing-mode https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
- text-orientation https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation
- mask (mask-image, mask-size, mask-repeat, mask-mode)
- background-clip https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip

## [Reuse](https://reuse.software/)

### Lint

`reuse lint`

### Add header

```bash
reuse addheader --copyright="Cas Dijkman" --license="GPL-3.0-only" --style="c" "<file>"
```

### Styles

| Language    | Comment | `--style` argument |
|-------------|---------|--------------------|
| C, JS, SASS | `//`    | `c`                |
| HTML        | `<!--`  | `html`             |
| Python      | `#`     | `python`           |
