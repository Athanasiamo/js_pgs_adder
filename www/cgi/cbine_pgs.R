#!/usr/bin/env Rscript

pgs_read <- function(path){
  pgs_data <- utils::read.table(
    path,
    header = TRUE,
    stringsAsFactors = FALSE
  )
  names(pgs_data) <- tolower(names(pgs_data))
  pgs_data[,3:6]
}

args = commandArgs(trailingOnly=TRUE)

fl <- list.files(args[1], "profile", full.names = TRUE)
data <- lapply(fl, pgs_read)
data <- do.call(cbind, data)

ids <-  utils::read.table(
  fl[1],
  header = TRUE,
  stringsAsFactors = FALSE
)

data <- cbind(ids[,1:2], data)

j <- apply(data, 1, paste, collapse="\t")
cat(paste(names(data), collapse="\t"))
cat("\n")
cat(j, sep="\n")
