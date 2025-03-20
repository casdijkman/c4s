#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2025 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

modules_not_responsive_able=(reset spanning-breakpoints forms)
modules_not_enabled=(forms)

function debug_modules() {
      npx sass --stdin << 'EOF'
@use 'variables';
@debug(variables.$modules-all);
EOF
}

modules_output=$(debug_modules 2>&1 | grep -F DEBUG)
modules_output="${modules_output/*DEBUG: /}"
IFS=',()' read -ra modules <<< "$modules_output"

{
    echo "["

    for module_string in "${modules[@]}"; do
        [[ -z $module_string ]] && continue

        module="$(echo "$module_string" | cut -d: -f 1)"
        module="${module//\"/}"
        module="${module// /}"
        is_responsive="$(echo "$module_string" | cut -d: -f 2)"
        is_responsive="${is_responsive// /}"
        responsive_able=true

        for item in "${modules_not_responsive_able[@]}"; do
            [[ $module == "$item" ]] && responsive_able=false
        done

        is_enabled=true

        for item in "${modules_not_enabled[@]}"; do
            [[ $module == "$item" ]] && is_enabled=false
        done

        echo "  {"
        echo "    \"name\": \"${module}\","
        echo "    \"isResponsive\": ${is_responsive},"
        echo "    \"responsiveAble\": ${responsive_able},"
        echo "    \"isEnabled\": ${is_enabled}"
        echo -n "  }"

         if [[ $module_string = "${modules[-1]}" ]]; then
            echo
        else
            echo ","
        fi
    done

    echo "]"
} >module-list.json
