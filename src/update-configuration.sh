#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2021 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s globstar
IFS=$'\n\t'

variables_file=./_variables.scss
custom_file=./c4s-custom.scss

_get_variables() {
    while read -r variable_line; do
	variable="${variable_line//:*/}"
	if [[ $variable != \$-* ]]; then
	    echo "$variable"
	fi
    done < <(grep '^$.*:' $variables_file)
}

_generate_mixin_definition() {
    echo "// Start generated configure mixin code"
    echo "/* stylelint-disable max-line-length, at-rule-empty-line-before */"
    echo -n "@mixin configure("

    for variable in $(_get_variables); do
	echo -n "$variable: null, "
    done

    echo -n ") { "

    for variable in $(_get_variables); do
	echo -n "@if $variable != null { $variable: $variable !global; } "
    done

    echo "}"
    echo "/* stylelint-enable max-line-length, at-rule-empty-line-before */"
}

_generate_mixin_invocation() {
    echo "/* stylelint-disable max-line-length, at-rule-empty-line-before */"
    echo -n "@include variables.configure("

    for variable in $(_get_variables); do
	echo -n "$variable: $variable, "
    done

    echo ");"
    echo "/* stylelint-enable max-line-length, at-rule-empty-line-before */"
}

_variables_file_base() {
    if [[ ! -f $variables_file ]]; then
	echo "Variables file not found"
	return 1
    fi

    first_line=$(_generate_mixin_definition | head -n 1)
    search_line=${first_line:3} # Remove characters that confuse sed (/)

    if ! grep -q "$search_line" $variables_file; then
	echo "Could not find first line of configure mixin"
	return 1
    fi

    sed "/$search_line/,\$d" $variables_file
}

_generate_variables_file() {
    _variables_file_base
    _generate_mixin_definition
}

_generate_custom_file() {
    _variables_file_base | head -n 6 | sed 's/\/\*!/\/\*/g'
    echo "// Set the @use statements for variables, load-modules and functions below to the correct paths"
    echo "@use './variables';"
    echo "@use './load-modules';"
    _variables_file_base | tail -n +7
    _generate_mixin_invocation
    echo "@include load-modules.load-modules();"
}

_update() {
    variables_file_content=$(_generate_variables_file)
    echo "$variables_file_content" >$variables_file

    custom_file_content=$(_generate_custom_file)
    search_string="{{ VERSION }}"
    replace_string=$(jq --raw-output ".version" <../package.json)
    echo "${custom_file_content//$search_string/$replace_string}" >$custom_file
}

_update
