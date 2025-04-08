<!--
SPDX-FileCopyrightText: 2025 Cas Dijkman

SPDX-License-Identifier: GFDL-1.3-only
-->

[![C4S website](https://img.shields.io/website?url=https://c4s.cdijkman.nl&style=flat-square&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0id2hpdGUiIHZpZXdCb3g9IjAgMCAxNiAxNiI+CiAgPHBhdGggZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTcuNS02LjkyM2MtLjY3LjIwNC0xLjMzNS44Mi0xLjg4NyAxLjg1NUE4IDggMCAwIDAgNS4xNDUgNEg3LjV6TTQuMDkgNGE5LjMgOS4zIDAgMCAxIC42NC0xLjUzOSA3IDcgMCAwIDEgLjU5Ny0uOTMzQTcuMDMgNy4wMyAwIDAgMCAyLjI1NSA0em0tLjU4MiAzLjVjLjAzLS44NzcuMTM4LTEuNzE4LjMxMi0yLjVIMS42NzRhNyA3IDAgMCAwLS42NTYgMi41ek00Ljg0NyA1YTEyLjUgMTIuNSAwIDAgMC0uMzM4IDIuNUg3LjVWNXpNOC41IDV2Mi41aDIuOTlhMTIuNSAxMi41IDAgMCAwLS4zMzctMi41ek00LjUxIDguNWExMi41IDEyLjUgMCAwIDAgLjMzNyAyLjVINy41VjguNXptMy45OSAwVjExaDIuNjUzYy4xODctLjc2NS4zMDYtMS42MDguMzM4LTIuNXpNNS4xNDUgMTJxLjIwOC41OC40NjggMS4wNjhjLjU1MiAxLjAzNSAxLjIxOCAxLjY1IDEuODg3IDEuODU1VjEyem0uMTgyIDIuNDcyYTcgNyAwIDAgMS0uNTk3LS45MzNBOS4zIDkuMyAwIDAgMSA0LjA5IDEySDIuMjU1YTcgNyAwIDAgMCAzLjA3MiAyLjQ3Mk0zLjgyIDExYTEzLjcgMTMuNyAwIDAgMS0uMzEyLTIuNWgtMi40OWMuMDYyLjg5LjI5MSAxLjczMy42NTYgMi41em02Ljg1MyAzLjQ3MkE3IDcgMCAwIDAgMTMuNzQ1IDEySDExLjkxYTkuMyA5LjMgMCAwIDEtLjY0IDEuNTM5IDcgNyAwIDAgMS0uNTk3LjkzM004LjUgMTJ2Mi45MjNjLjY3LS4yMDQgMS4zMzUtLjgyIDEuODg3LTEuODU1cS4yNi0uNDg3LjQ2OC0xLjA2OHptMy42OC0xaDIuMTQ2Yy4zNjUtLjc2Ny41OTQtMS42MS42NTYtMi41aC0yLjQ5YTEzLjcgMTMuNyAwIDAgMS0uMzEyIDIuNW0yLjgwMi0zLjVhNyA3IDAgMCAwLS42NTYtMi41SDEyLjE4Yy4xNzQuNzgyLjI4MiAxLjYyMy4zMTIgMi41ek0xMS4yNyAyLjQ2MWMuMjQ3LjQ2NC40NjIuOTguNjQgMS41MzloMS44MzVhNyA3IDAgMCAwLTMuMDcyLTIuNDcyYy4yMTguMjg0LjQxOC41OTguNTk3LjkzM00xMC44NTUgNGE4IDggMCAwIDAtLjQ2OC0xLjA2OEM5LjgzNSAxLjg5NyA5LjE3IDEuMjgyIDguNSAxLjA3N1Y0eiIvPgo8L3N2Zz4K)](https://c4s.cdijkman.nl/)

[![REUSE status](https://img.shields.io/reuse/compliance/github.com/casdijkman/c4s?style=flat-square)](https://api.reuse.software/info/github.com/casdijkman/c4s)

![c4s.min.css gzip file size](https://img.badgesize.io/casdijkman/c4s/master/dist/c4s.min.css?compression=gzip&style=flat-square)

<p align="center">
    <a href="https://c4s.cdijkman.nl/">
        <img src="https://c4s.cdijkman.nl/logo.svg" alt="C4S logo" width="200">
    </a>
</p>

# Concise Configurable Composable Classes Stylesheets (C4S)

C4S [*c force*] is a functional, customizable CSS library for front-end web development.

## Get started

- Go to the [C4S website](https://c4s.cdijkman.nl) for an overview of the available
  stylesheets and the project's documentation.
- Include a C4S stylesheet in your HTML and you're good to go!

## Install with Node Package Manager (`npm`)

- `npm install --save-dev @casd/c4s`

or with `yarn`

- `yarn add --dev @casd/c4s`

The pre-built .css files can be found in the [`dist`](./dist) directory.

You can use C4S with SCSS, just [import](https://sass-lang.com/documentation/at-rules/use/)
the main file with `@use 'node_modules/@casd/c4s/src/c4s';`

For customizing, you can start by copying [c4s-custom.scss](./src/c4s-custom.scss) into
your project and customize all you like 😄

## Install project on your device

- Clone this repository to your computer
- Make sure the `yarn` package manager is installed on your computer
- Install node packages by running `yarn install` in the project's root folder

### Build and develop

- Make sure the project is installed (see instructions above)
- Build the CSS and documentation by
  - running `yarn build`, **or**
  - running `yarn start` to also watch changes and serve the documentation locally

## Philosophy and inspiration

- [Functional CSS](https://mrmrs.cc/writing/scalable-css/),
  also known als [atomic CSS](https://css-tricks.com/lets-define-exactly-atomic-css/)
- [Tachyons](https://tachyons.io/)
  (by [John Otander](https://www.johno.com/), [Adam Morse](https://mrmrs.io/) and
  [others](https://github.com/tachyons-css/tachyons/graphs/contributors))

## Copyright and license

Code and documentation copyright © 2024 [Cas Dijkman](https://cdijkman.nl).
Code released under the [GNU GPL version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).
Documentation released under [GNU FDL version 1.3](https://www.gnu.org/licenses/fdl-1.3.html).
Copies of the licenses can be found in the [LICENSES directory](LICENSES).

This software is distributed as free software in the hope that it will be useful, but
without any warranty; without even the implied warranty of merchantability or fitness for
a particular purpose.
