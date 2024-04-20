#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

files=(
    ./_variables.scss
    ./c4s-custom.scss
)

for file in "${files[@]}"; do
    content=$(cat "$file")

    {
        version=$(jq --raw-output ".version" <../package.json)
        search='C4S CSS, version .*'
        replace="C4S CSS, version ${version} <https:\/\/c4s.cdijkman.nl>"
        # shellcheck disable=SC2001
        sed "s/${search}/${replace}/" <<<"$content"
    } >"$file"
done
