#!/usr/bin/env bash

# SPDX-FileCopyrightText: 2021 Cas Dijkman
#
# SPDX-License-Identifier: GPL-3.0-only

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

module_file_suffix='-module'

command rm -f ./modules/*-module.scss

for file in ./modules/_*.scss; do
    basename=$(basename "$file")
    basename_clean="${basename:1}" # Remove first character (being _)
    module_name="${basename_clean/.scss/}"
    new_basename="${basename_clean/.scss/$module_file_suffix.scss}"
    module_file="${file/$basename/$new_basename}"

    cat << EOF > "$module_file"
/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

@use './${module_name}';

@include ${module_name}.${module_name}();
EOF
done
