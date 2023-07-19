#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2021 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

variables_file="_variables.scss"
modules_line_start="$(grep -n "\$modules" <"$variables_file" | cut -d: -f 1)"
((modules_line_start++))
modules=()

while read -r line; do
    [[ $line = *")"* ]] && break
    module="$(echo "${line//\'/}" | cut -d: -f 1)"
    modules+=("$module")
done< <(tail -n+"$modules_line_start" "$variables_file")

{
    echo -n "["
    for module in "${modules[@]}"; do
        echo -n "\"${module}\""
        [[ $module != "${modules[-1]}" ]] && echo -n ", "
    done
    echo "]"
} >module-list.json
