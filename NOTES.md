<!--
SPDX-FileCopyrightText: 2024 Cas Dijkman

SPDX-License-Identifier: GPL-3.0-only
-->

# Notes

## To do

- Complete css class examples documentation    
  `(cd docs/partials/examples/ && grep -Fre exampleNotFound --exclude _generic.njk)`
- Enable and publish source maps
  See: https://stackoverflow.com/a/38442789
- Rewrite shell scripts to be node scripts (low priority)

- automatic column division with `.col-fr` (?)
  Elements with number of children being a factor of 12 (1, 2, 3, 4, 6, 12)
  could have an automatic distribution of same-size space based on
  [this technique](https://stackoverflow.com/a/12198561).

### Modules to add

- outline (similar to border (color, width, style (solid, dashed, dotted etc.)))
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
- [x] Radio button
- [ ] Button
- [ ] Text input with floating label (input type text/password/email & textarea)
      https://getbootstrap.com/docs/5.0/forms/floating-labels/
- [x] Create extra build that includes forms
- [ ] Add styling for `disabled` checkbox and radio buttons

## [Reuse](https://reuse.software/)

### Lint

`reuse lint`

### Add header

```bash
reuse addheader --copyright="Cas Dijkman" --license="GPL-3.0-only" --style="c" "<file>"
```

### Styles

| Language      | Comment | `--style` argument |
|---------------|---------|--------------------|
| C, JS, Sass   | `//`    | `c`                |
| HTML          | `<!--`  | `html`             |
| Python, Shell | `#`     | `python`           |
