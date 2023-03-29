#!/bin/bash

tracepathJSON() {
    DESTINATION=$1
    HOPS_COUNTER=$2
    tracepath "$DESTINATION" -n -m $HOPS_COUNTER |
        grep -v 'no reply' |
        grep -P "[\d]:" |
        tr -s " " |
        awk '{$1=$1};1' |
        awk -F "[: ]" '{printf "{\"hop\": %s, \"ip\": \"%s\", \"raw\": \"%s\"}\n", $1, $3, $0}' |
        jq -s '.' -c
}

tracepathJSON $@
