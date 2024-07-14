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
- nested styles (in complex module?)
- transform: rotate
- writing-mode https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
- text-orientation https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation
- text-decoration-style (part of text-decoration module)
  https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style
- mask (mask-image, mask-size, mask-repeat, mask-mode)
- background-clip https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip

#### Forms

Create easy-to-use default styling for form inputs.

- [x] Checkbox
- [x] Button group
- [ ] Radio button
- [ ] Button
- [ ] Text input with floating label (input type text/password/email & textarea)
- [x] Create extra build that includes forms

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
