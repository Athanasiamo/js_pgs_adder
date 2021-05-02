#!/usr/bin/env bash

printf "Content-Type: application/octet-stream\r\n"
printf "\r\n"

declare paper_id=$(echo ${QUERY_STRING:1}  | cut -d'?' -f1)
declare pgs_id=$(echo ${QUERY_STRING:1}  | cut -d'?' -f2)

Rscript cbine_pgs.R ${DATADIR}/pgs_${paper_id}/${pgs_id}

