#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2025 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

_GENERATE=0

while ((${#})); do
    __arg="${1:-}"

    case "${__arg}" in
        --generate)
            _GENERATE=1
            ;;
        -*)
            printf "Unexpected option: %s\\n" "${__arg}"
            exit 1
            ;;
    esac

    shift
done

_getModules() {
    for file in modules/_*.scss; do
        basename=$(basename "$file")
        new_file="${basename:1}" # Remove first character (being _)
        module_name="${new_file/.scss/}"

        echo "$module_name"

        [[ $1 == "first" ]] && return
    done
}

_generate(){
    cat << EOF
/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */
EOF
    echo
    echo "@use 'sass:map';"
    echo "@use 'variables';"
    echo "@use 'mixins';"

    for module in $(_getModules); do
        echo "@use 'modules/$module';"
    done

    echo
    echo "@mixin load-modules(\$modules: null, \$breakpoints: null) {"
    echo "  @if not \$modules {"
    echo "    \$modules: variables.\$modules;"
    echo "  }"
    echo
    echo "  @if not \$breakpoints {"
    echo "    \$breakpoints: variables.\$breakpoints;"
    echo "  }"
    echo

    echo "  @each \$module, \$responsive in \$modules {"

    for module in $(_getModules); do
        if [[ $module == $(_getModules first) ]]; then
            echo "    @if \$module == $module {"
            echo "      @include $module.${module};"
            echo -n "    }"
        else
            echo " @else if \$module == $module {"
            echo "      @include $module.${module};"
            echo -n "    }"
        fi
    done

    echo " @else {"
    echo "      @error 'Module not found:' \$module;"
    echo "    }"
    echo "  }"
    echo

    echo "  @each \$breakpoint, \$map in \$breakpoints {"
    echo "    @include mixins.media-breakpoint-up(\$breakpoint) {"
    echo "      @each \$module, \$responsive in \$modules {"

    for module in $(_getModules); do
        if [[ $module == $(_getModules first) ]]; then
            echo "        @if \$module == $module and \$responsive {"
            echo "          @include $module.$module(\$breakpoint);"
            echo -n "        }"
        else
            echo " @else if \$module == $module and \$responsive {"
            echo "          @include $module.$module(\$breakpoint);"
            echo -n "        }"
        fi
    done

    echo
    echo "      }"
    echo "    }"
    echo "  }"
    echo "}"
}

_update() {
    load_modules_file=./_load-modules.scss

    if [[ -f $load_modules_file ]]; then
        _generate >$load_modules_file
    else
        echo "Load modules file not found, exiting"
        exit 1
    fi
}

if (( _GENERATE )); then
    _generate
else
    _update
fi
