#!/usr/bin/env bash

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

_generate(){
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
}

_update() {
    loadModulesFile=./_load-modules.scss

    if [[ -f $loadModulesFile ]]; then
	$0 --generate >$loadModulesFile
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
