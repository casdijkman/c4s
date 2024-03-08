#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

shopt -s extglob

variables_file="_variables.scss"
module_lines_start="$(grep -n "\$modules" <"$variables_file" | head -n1 | cut -d: -f 1)"
((module_lines_start++))
module_lines="$(tail -n+"$module_lines_start" "$variables_file")"
module_lines_end="$(echo "$module_lines" | grep -n ")" | head -n1 | cut -d: -f 1)"
((module_lines_end--))
module_lines="$(echo "$module_lines" | head -n"$module_lines_end")"
last_line="$(echo "$module_lines" | tail -n1)"
last_line="$(printf '%s\n' "${last_line##+([[:space:]])}")"
not_responsive_modules=(reset spanning-breakpoints)

{
    echo "["

    while read -r line; do
        line_clean="$(echo "$line" | xargs)"
        line_clean="${line_clean//,/}"
        line_clean="${line_clean// /}"
        is_enabled=true
        [[ $line_clean = //* ]] && is_enabled=false
        line_clean="${line_clean//\//}"

        module="$(echo "$line_clean" | cut -d: -f 1)"
        is_responsive="$(echo "$line_clean" | cut -d: -f 2)"
        responsive_able=true

        for item in "${not_responsive_modules[@]}"; do
            [[ $module == "$item" ]] && responsive_able=false
        done

        echo "  {"
        echo "    \"name\": \"${module}\","
        echo "    \"isResponsive\": ${is_responsive},"
        echo "    \"responsiveAble\": ${responsive_able},"
        echo "    \"isEnabled\": ${is_enabled}"
        echo -n "  }"

        if [[ $line = "$last_line" ]]; then
            echo
        else
            echo ","
        fi
    done< <(echo "$module_lines")

    echo "]"
} >module-list.json
