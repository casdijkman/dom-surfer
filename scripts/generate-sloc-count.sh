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

if [[ ! -f jquery.js ]] || [[ ! -f sizzle.js ]]; then
    echo "Could not find required files"
    exit 1
fi

cat <<EOF
### Source lines of code (SLOC) comparison

| Dom Surfer | jQuery | Sizzle (selector engine only) |
|------------|--------|-------------------------------|
| $(print_sloc_count ../dom-surfer.js) | $(print_sloc_count jquery.js) | $(print_sloc_count sizzle.js) |
EOF
