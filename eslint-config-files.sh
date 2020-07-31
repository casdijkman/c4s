#!/usr/bin/env bash

# This hacky script is needed because config files (dotfiles) are ignored by default
# and there is apparently no way to counteract this in eslint-gulp.
yarn eslint .*.js --ignore-pattern '!.*'
