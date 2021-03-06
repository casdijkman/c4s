#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2021 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

[[ ! $(command -v shellcheck) ]] && echo "shellcheck is not installed" && exit 1

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

grep -rl '^#!/usr/bin/env bash' | while IFS= read -r file; do
    path=$(realpath "$file")
    basename=$(basename "$path")

    if [[ ! $file =~ .*node_modules.* ]] && [[ ! $basename == \#* ]] && [[ ! $basename == *~ ]]; then
	shellcheck "$path" && printf "PASSED\t\t%s\n" "$file"
    fi
done
