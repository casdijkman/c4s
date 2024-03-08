#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

function get_bootstrap_url() {
    echo "https://icons.getbootstrap.com/assets/icons/${1}.svg"
}

function get_ionicons_url() {
    echo "https://unpkg.com/ionicons@latest/dist/svg/${1}.svg"
}

force=false
case $1 in
    -f|-force) force=true;;
esac
shift

# https://icons.getbootstrap.com/
bootstrap_icons=(
    sort-alpha-down-alt
    sort-alpha-up
    sort-numeric-down-alt
    sort-numeric-up
    grip-horizontal
)

# https://ionic.io/ionicons
ionicons_icons=(
    arrow-up-outline
    download-outline
    logo-github
    refresh-outline
)

for icon in "${bootstrap_icons[@]}"; do
    url="$(get_bootstrap_url "$icon")"
    directory=bootstrap
    mkdir -p "$directory"
    out_file="${directory}/${icon}.svg"

    [[ -f "$out_file" ]] && ! $force && continue
    echo "Getting $out_file"
    curl -L "$url" >"$out_file"
done

for icon in "${ionicons_icons[@]}"; do
    url="$(get_ionicons_url "$icon")"
    directory=ionicons
    mkdir -p "$directory"
    out_file="${directory}/${icon}.svg"

    [[ -f "$out_file" ]] && ! $force && continue
    echo "Getting $out_file"
    curl -L "$url" >"$out_file"
done
