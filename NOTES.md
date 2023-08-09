<!--
SPDX-FileCopyrightText: 2021 Cas Dijkman

SPDX-License-Identifier: GPL-3.0-only
-->

# Notes

## TODO

- Enable and publish source maps?
    See: https://stackoverflow.com/a/38442789
- Rewrite shell scripts to be node scripts

### Modules

- forms (exclude from default build, create extra build that includes forms)
- nested styles (in complex module?)
- transform: rotate
- writing-mode https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode
- text-orientation https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation
- mask (mask-image, mask-size, mask-repeat, mask-mode)
- pointer-events

## Reuse

### Lint

`reuse lint`

### Add header

`reuse addheader --copyright="Cas Dijkman" --license="GPL-3.0-only" --style="<style>" <file>`

### Styles

| Language | Comment | --style arg |
|----------|---------|-------------|
| Python   | `#`     | `python`    |
| C        | `//`    | `c`         |
| HTML     | `<!--`  | `html`      |

## Other notes

hex-to-hsl-colors.sh

```bash
#!/usr/bin/env bash

while read -r line; do
    name=$(echo "$line" | cut -d "#" -f1 | sed 's/[^0-z-]//g')
    code="#$(echo "$line" | cut -d "#" -f2 | sed 's/[^0-z-]//g')"
    hsl=$(pastel format hsl "$code")
    sed -i "s/${code}/${hsl}/g" _variables.scss

    echo "Name:      $name"
    echo "Hex code:  $code"
    echo "HSL color: $hsl"
    # echo "s/${code}/${hsl}/g"
    echo
done < <(grep "#" _variables.scss | grep -v "#{" | tac)
```
