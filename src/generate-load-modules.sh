#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

if [[ $1 == --modules ]]; then
    echo "\$modules: ("
    for file in modules/_*.scss; do
	baseName=$(basename "$file")
	newFile="${baseName:1}" # Remove first character (being _)
	moduleName="${newFile/.scss/}"
	echo -n "  $moduleName: "
	if [[ $directory == responsive ]]; then
	    echo -n "true"
	else
	    echo -n "false"
	fi
	echo ","
    done
    echo ");"
    exit 0
fi

echo "@use 'sass:map';"
echo "@use '../variables';"

for file in modules/_*.scss; do
    baseName=$(basename "$file")
    newFile="${baseName:1}" # Remove first character (being _)
    moduleName="${newFile/.scss/}"

    echo "@use './$directory/$moduleName';"
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
    echo "      @include $moduleName.$moduleName('');"
    echo
    echo "      @if \$responsive {"
    echo "        @each \$breakpoint, \$map in \$breakpoints {"
    echo "          @include $moduleName.$moduleName(\$breakpoint);"
    echo "        }"
    echo "      }"
    echo "    }"
    echo
done

echo "  }"
echo "}"
