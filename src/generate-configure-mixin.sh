#!/usr/bin/env bash

#set -x # Enable debugging

shopt -s globstar
IFS=$'\n\t'

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

variables=()

while read -r variable_line; do
    variables+=("${variable_line//:*/}")
done < <(grep '^$.*:' _variables.scss)

echo "@mixin configure("

for variable in "${variables[@]}"; do
    echo -n "  $variable: null"
    if [[ $variable == "${variables[-1]}" ]]; then
	echo
    else
	echo ","
    fi
done

echo ") {"

for variable in "${variables[@]}"; do
    cat <<EOF
  @if $variable != null {
    $variable: $variable !global;
  }
EOF

    if [[ $variable != "${variables[-1]}" ]]; then
	echo
    fi
done

echo "}"
