#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

for file in ./modules/_*.scss; do
    baseName=$(basename "$file")
    newBaseName="${baseName:1}" # Remove first character (being _)
    moduleName="${newBaseName/.scss/}"
    newBaseName="${newBaseName/.scss/-module.scss}"
    newFile="${file/$baseName/$newBaseName}"

    touch "$newFile"
    cat << EOF > "$newFile"
@use './$moduleName';

@include $moduleName.$moduleName();
EOF
done
