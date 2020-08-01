#!/usr/bin/env bash

shopt -s globstar

gzip --force --keep dist/**/*.css

# Print sizes of files in dist directory
du --human-readable --apparent-size dist/**/*.css
echo
du --human-readable --apparent-size dist/**/*.gz
