#!/usr/bin/env Rscript
datadir <- Sys.getenv("DATADIR")

args <- commandArgs(trailingOnly = TRUE)
args <- gsub("^=|/", "", args)
args <- unlist(strsplit(args, "\\&\\&"))
args <- sapply(args, strsplit, split = "\\&")

merge_all <- function(x, y) {
    merge(x, y, all = TRUE, by = c("geneinfo_fid", "geneinfo_iid"))
}

pgs_read <- function(path){
  pgs_data <- utils::read.table(
    path,
    header = TRUE,
    stringsAsFactors = FALSE
  )
  pgs_data_sub <-  pgs_data[,3:6]
  s <- gsub("\\.profile", "", basename(path))
  s <- gsub("\\.", "_", s)
  s <- paste(basename(dirname(dirname(path))),
              s[length(s)],
              sep = "_")
  names(pgs_data_sub) <- tolower(paste(s, names(pgs_data_sub), sep = "_"))
  pgs_data <- cbind(pgs_data[, 1:2], pgs_data_sub)
  names(pgs_data_sub)[1:2] <- c("geneinfo_fid", "geneinfo_iid")
  pgs_data
}

get_pgs <- function(args){
  args <- unlist(strsplit(args, "\\&"))
  args <- setNames(
          sapply(args, function(x) 
                  sapply(strsplit(x, "=")[[1]][2], strsplit, split = ",")),
          sapply(args, function(x) strsplit(x, "=")[[1]][1])
          )
  args["id"] <- paste0("pgs_", args["id"])

  fl <- list.files(
    path = file.path(datadir, args["id"], args["pgs"]),
    pattern = paste0(args[["slevel"]], "\\.profile", collapse = "|"),
    full.names = TRUE
  )
  data <- lapply(fl, pgs_read)
  data <- Reduce(merge_all, data)
  data <- as.data.frame(data, stringsAsFactors = FALSE)
  names(data)[1:2] <- sprintf("geneinfo_%s", c("fid", "iid"))
  data
}

data <- lapply(args, get_pgs)
data <- Reduce(merge_all, data)
data <- as.data.frame(data, stringsAsFactors = FALSE)

cat(
  paste(names(data), collapse = "\t"),
  apply(data, 1, paste, collapse = "\t"),
  sep = "\n"
)
