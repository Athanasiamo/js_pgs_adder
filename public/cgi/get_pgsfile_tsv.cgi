#!/usr/bin/env bash

printf "Content-Type: application/octet-stream\r\n"
printf "Content-Disposition: attachment; filename=teste.png\r\n"
printf "\r\n"

Rscript cbine_pgs.R ${QUERY_STRING} 

