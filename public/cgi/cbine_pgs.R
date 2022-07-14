#!/usr/bin/env Rscript

pgs_read <- function(path){
  pgs_data <- utils::read.table(
    path,
    header = TRUE,
    stringsAsFactors = FALSE
  )
  pgs_data <-  pgs_data[,3:6]

  s <- gsub("\\.profile", "", basename(path))
  s <- strsplit(s, "\\.")[[1]]
  s <- s[length(s)]

  names(pgs_data) <- tolower(paste(s, names(pgs_data), sep = "_"))
  pgs_data
}

args <- commandArgs(trailingOnly=TRUE)
pattern <- gsub(",", "\\.profile$|", args[2])

fl <- list.files(
  path = args[1],
  pattern = paste0(pattern, "\\.profile$"),
  full.names = TRUE
)
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
