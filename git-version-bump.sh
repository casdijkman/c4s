#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2024 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

[[ ! -f package.json ]] && echo "Could not find package.json" && exit 1

if [[ $(git status --porcelain package.json | wc -l) -ne 0 ]]; then
    echo "package.json has already been modified. Aborting version bump"
    exit 1
fi

function update_version() {
    version="$(jq -r '.version' <package.json)"

    if ! echo "$version" | grep -qE "^[0-9]+\.[0-9]+\.[0-9]+$"; then
        echo "Version not expected format"
        exit 1
    fi

    version_minor="$(echo "$version" | rev | cut -d'.' -f1 | rev)"
    new_version="$(echo "$version" | cut -d'.' -f-2).$(( version_minor + 1 ))"
    echo "Updating version: ${version} => ${new_version}"
    version="$new_version"
    new_package="$(jq --arg version "$version" '.version = $version' package.json)"
    cat <<< "$new_package" >package.json
}

function build() {
    echo Building...
    sleep 1
    yarn build || exit 1
    yarn lint
    [[ "$(command -v alert)" ]] && alert
    [[ "$(command -v notify-gong)" ]] && notify-gong
}

function git_commit() {
    git add dist/ src/_variables.scss src/c4s-custom-verbose.scss package.json
    version_string="v$(jq -r '.version' <package.json)"
    git commit -m "$version_string"
    git tag "$version_string"
}

update_version
echo "$1" | grep -qE "^-(b|-build)$" && build
git_commit
exit 0
