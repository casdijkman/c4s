#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

echo "@use 'sass:map';"
echo "@use 'variables';"
echo "@use 'mixins';"

for file in modules/_*.scss; do
    baseName=$(basename "$file")
    newFile="${baseName:1}" # Remove first character (being _)
    moduleName="${newFile/.scss/}"

    echo "@use 'modules/$moduleName';"
done

echo
echo "@mixin load-modules(\$modules: null, \$breakpoints: null) {"
echo "  @if \$modules == null {"
echo "    \$modules: variables.\$modules;"
echo "  }"
echo
echo "  @if \$breakpoints == null {"
echo "    \$breakpoints: variables.\$breakpoints;"
echo "  }"
echo
echo "  @each \$module, \$responsive in \$modules {"

for file in modules/_*.scss; do
    baseName=$(basename "$file")
    newFile="${baseName:1}" # Remove first character (being _)
    moduleName="${newFile/.scss/}"

    echo "    @if \$module == $moduleName {"
    echo "      @include $moduleName.$moduleName();"
    echo
    echo "      @if \$responsive {"
    echo "        @each \$breakpoint, \$map in \$breakpoints {"
    echo "          @include mixins.media-breakpoint-up(\$breakpoint) {"
    echo "            @include $moduleName.$moduleName(\$breakpoint);"
    echo "          }"
    echo "        }"
    echo "      }"
    echo "    }"
    echo
done

echo "  }"
echo "}"
