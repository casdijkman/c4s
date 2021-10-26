#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s globstar
IFS=$'\n\t'

_GENERATE=0

while ((${#})); do
  __arg="${1:-}"

  case "${__arg}" in
      --generate)
          _GENERATE=1
          ;;
      -*)
          printf "Unexpected option: %s\\n" "${__arg}"
          exit 1
          ;;
  esac

  shift
done

_generate() {
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
}

_update() {
    variablesFile=./_variables.scss

    if [[ ! -f $variablesFile ]]; then
	echo "Variables file not found, exiting"
	exit 1
    fi

    firstLine=$($0 --generate | head -n 1)
    searchLine=${firstLine:3} # Remove characters that confuse sed (/)

    if ! grep -q "$searchLine" $variablesFile; then
	echo "Could not find first line of configure mixin"
	exit 1
    fi

    sed -i "/$searchLine/,\$d" $variablesFile
    $0 --generate >>$variablesFile
}

if (( _GENERATE )); then
    _generate
else
    _update
fi
