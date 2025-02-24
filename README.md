<!--
SPDX-FileCopyrightText: 2024 Cas Dijkman

SPDX-License-Identifier: GFDL-1.3-only
-->

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
