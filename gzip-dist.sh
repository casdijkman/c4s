#!/usr/bin/env bash

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s globstar

if [[ -d dist ]]; then
    gzip --force --keep dist/**/*.css

    # Print sizes of css files in dist directory
    du --human-readable --apparent-size dist/**/*.css
    echo

    # Print sizes of gzipped css files in dist directory
    du --human-readable --apparent-size dist/**/*.gz
fi

