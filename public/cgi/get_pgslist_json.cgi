#!/usr/bin/env bash

printf "Content-Type: application/json; charset=UTF-8\r\n"
printf "\r\n"


echo '{'
declare i=0
while read pgs_cat; do 
  if [ $i -ne 0 ]; then printf ','; fi
  printf '"%s":\n' $pgs_cat
  cat ${DATADIR}/pgs_${pgs_cat}/_metadata.json | sed -e s/}//g
  printf '  ,"pgs": {\n'
  declare j=0
  while read pgs_d; do 
    declare pgs=${pgs_d%%/}
    if [ $j -ne 0 ]; then printf ','; fi
    printf '"%s":\n' $pgs
    cat ${DATADIR}/pgs_${pgs_cat}/${pgs}/_metadata.json
    (( j++ ))
  done < <(cd ${DATADIR}/pgs_${pgs_cat}/ && ls -d */) 
  echo '}}'
  (( i++ ))
done < <(cd ${DATADIR}/ && ls | sed "s/pgs_//") 

echo '}'
