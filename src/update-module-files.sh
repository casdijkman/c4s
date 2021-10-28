#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

moduleFileSuffix='-module'

command rm -f ./modules/*-module.scss

for file in ./modules/_*.scss; do
    baseName=$(basename "$file")
    baseNameClean="${baseName:1}" # Remove first character (being _)
    moduleName="${baseNameClean/.scss/}"
    newBaseName="${baseNameClean/.scss/$moduleFileSuffix.scss}"
    moduleFile="${file/$baseName/$newBaseName}"

    cat << EOF > "$moduleFile"
@use './$moduleName';

@include $moduleName.$moduleName();
EOF
done
