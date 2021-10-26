#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

scripts=(update-configure-mixin.sh update-module-files.sh update-load-modules-mixin.sh)

for script in "${scripts[@]}"; do
    if [[ -x $script ]]; then
        ./"$script"
    else
	echo "Could not find script: $script"
    fi
done
