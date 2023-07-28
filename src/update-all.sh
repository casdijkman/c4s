#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2021 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

scripts=(
    update-custom-verbose.sh
    update-load-modules-mixin.sh
    update-module-files.js
    update-module-list.sh
    update-version.sh
)

for script in "${scripts[@]}"; do
    if [[ ! -x $script ]]; then
	echo "Could not find script: $script"
        continue
    fi

    ./"$script"
done
