#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s globstar
IFS=$'\n\t'

variablesFile=./_variables.scss
externalFile=./c4s-custom.scss

_getVariables() {
    while read -r variable_line; do
	variable="${variable_line//:*/}"
	if [[ $variable != \$-* ]]; then
	    echo "$variable"
	fi
    done < <(grep '^$.*:' $variablesFile)
}

_generateMixinDefinition() {
    echo "// Start generated configure mixin code"
    echo "/* stylelint-disable max-line-length, at-rule-empty-line-before */"
    echo -n "@mixin configure("

    for variable in $(_getVariables); do
	echo -n "$variable: null, "
    done

    echo -n ") { "

    for variable in $(_getVariables); do
	echo -n "@if $variable != null { $variable: $variable !global; } "
    done

    echo "}"
    echo "/* stylelint-enable max-line-length, at-rule-empty-line-before */"
}

_generateMixinInvocation() {
    echo "/* stylelint-disable max-line-length, at-rule-empty-line-before */"
    echo -n "@include variables.configure("

    for variable in $(_getVariables); do
	echo -n "$variable: $variable, "
    done

    echo ");"
    echo "/* stylelint-enable max-line-length, at-rule-empty-line-before */"
}

_variablesFileBase() {
    if [[ ! -f $variablesFile ]]; then
	echo "Variables file not found"
	return 1
    fi

    firstLine=$(_generateMixinDefinition | head -n 1)
    searchLine=${firstLine:3} # Remove characters that confuse sed (/)

    if ! grep -q "$searchLine" $variablesFile; then
	echo "Could not find first line of configure mixin"
	return 1
    fi

    sed "/$searchLine/,\$d" $variablesFile
}

_variablesFile() {
    _variablesFileBase
    _generateMixinDefinition
}

_externalFile() {
    echo "// Set the @use statements for variables, load-modules and functions below to the correct paths"
    echo "@use './variables';"
    echo "@use './load-modules';"
    _variablesFileBase
    _generateMixinInvocation
    echo "@include load-modules.load-modules();"
}

_update() {
    variablesFileContent=$(_variablesFile)
    echo "$variablesFileContent" >$variablesFile

    externalFileContent=$(_externalFile)
    echo "$externalFileContent" >$externalFile
}

_update
