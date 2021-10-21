#!/usr/bin/env bash

#set -x # Enable debugging

shopt -s globstar
IFS=$'\n\t'

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

variables=()

while read -r variable_line; do
    variable="${variable_line//:*/}"
    if [[ $variable != \$-* ]]; then
	variables+=("$variable")
    fi
done < <(grep '^$.*:' _variables.scss)

echo "// Start generated configure mixin code"
echo "/* stylelint-disable max-line-length, at-rule-empty-line-before */"
echo -n "@mixin configure("

for variable in "${variables[@]}"; do
    echo -n "$variable: null"
    if [[ $variable != "${variables[-1]}" ]]; then
	echo -n ", "
    fi
done

echo -n ") { "

for variable in "${variables[@]}"; do
    echo -n "@if $variable != null { $variable: $variable !global; } "
done

echo "}"
echo "/* stylelint-enable max-line-length, at-rule-empty-line-before */"
