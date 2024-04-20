#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

function lintBashScripts() {
    if [[ ! $(command -v shellcheck) ]]; then
        echo "shellcheck is not installed"
        return
    fi

    echo "Linting bash scripts with shellcheck..."

    shebang="#!/usr/bin/env bash"
    grep -rl "^${shebang}" | while IFS= read -r file; do
        if [[ "$(head -n1 "$file")" != "$shebang" ]]; then
            # echo "Skipping '$file'"
            continue
        fi

        path=$(realpath "$file")
        basename=$(basename "$path")

        if [[ ! $file =~ .*node_modules.* ]] && [[ ! $basename == \#* ]] && [[ ! $basename == *~ ]]; then
            shellcheck "$path" && printf "PASSED\t\t%s\n" "$file"
        fi
    done
    echo
}

lintBashScripts
yarn lint

eslintBin="./node_modules/eslint/bin/eslint.js"
if [[ $(command -v node) ]] && [[ -f "$eslintBin" ]]; then
    echo -e "\nLinting configuration files with eslint..."
    if node "$eslintBin" .*.js --ignore-pattern '!.*'; then
        echo Success
    fi
fi

if [[ $(command -v reuse) ]]; then
    echo -e "\nLinting with reuse (licensing for reusable code)..."
    reuse lint
fi
