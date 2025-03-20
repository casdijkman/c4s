#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2025 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s globstar
IFS=$'\n\t'

variables_file=./_variables.scss
custom_file=./c4s-custom-verbose.scss

_get_variables() {
    while read -r variable_line; do
        variable="${variable_line//:*/}"
        [[ $variable != \$-* ]] && echo "$variable"
    done < <(grep '^$.*:' $variables_file)
}

_generate_custom_file() {
    head -n6 <"$variables_file"

    echo "// Set the @use statements for variables, load-modules and functions below to the correct paths"
    echo "@use './variables' as c4s;"
    echo "@use './load-modules';"

    tail -n +7 <"$variables_file"

    echo
    echo "// Overwrite variables"

    for variable in $(_get_variables); do
        echo -n "c4s.$variable: $variable; "
    done

    echo "// stylelint-disable max-line-length, declaration-block-semicolon-newline-after"
    echo
    echo "@include load-modules.load-modules;"
}

custom_file_content=$(_generate_custom_file)
echo "$custom_file_content" | sed 's/\/\*!/\/\*/g' >$custom_file
