#!/usr/bin/env bash

#set -x # Enable debugging

[[ $(dirname "$(realpath "$0")") != $(pwd) ]] && echo "Run script from it's own directory" && exit 1

[[ ! $(command -v wget) ]] && echo "wget is not installed" && exit 1

function print_sloc_count() {
    local file
    file="$1"

    sloccount "$file" | \
        grep -F "Total Physical Source Lines of Code" | \
        sed "s/.*= //"
}

# jQuery
[[ -f jquery.js ]] && rm jquery.js
wget https://cdn.jsdelivr.net/npm/jquery@3.7/dist/jquery.js &>/dev/null

# Sizzle
[[ -f sizzle.js ]] && rm sizzle.js
wget https://cdn.jsdelivr.net/npm/sizzle@2.3/dist/sizzle.js &>/dev/null


cat <<EOF
### Standard lines of code (SLOC) count

| Dom Surfer | jQuery | Sizzle |
|------------|--------|--------|
| $(print_sloc_count ../dom-surfer.js) | $(print_sloc_count jquery.js) | $(print_sloc_count sizzle.js) |
EOF
