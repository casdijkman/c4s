#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

variablesFile=./_variables.scss
generateMixinFile=./generate-configure-mixin.sh

if [[ ! -f $variablesFile ]] || [[ ! -x $generateMixinFile ]]; then
    exit 1
fi

firstLine=$($generateMixinFile | head -n 1)

if ! grep -q "$firstLine" $variablesFile; then
    exit 1
fi

sed -i "/$firstLine/,\$d" $variablesFile
$generateMixinFile >>$variablesFile
