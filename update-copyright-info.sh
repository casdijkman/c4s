#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

[[ ! $(command -v grep) ]] && echo "grep is not installed" && exit 1

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1


year_old="2024"
year_new=$(date +%Y)

copyright_holder="Cas Dijkman"
copyright_old="${year_old} ${copyright_holder}"
copyright_new="${year_new} ${copyright_holder}"

while read -r file; do
    sed -i "s/${copyright_old}/${copyright_new}/g" "${file}"
done< <(
    grep -Frle "${copyright_old}" \
         --exclude-dir=node_modules/ \
         --exclude-dir=dist/
)
