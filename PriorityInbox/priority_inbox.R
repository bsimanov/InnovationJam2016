# File-Name:       priority_inbox.R           
# Date:            2011-11-01                             
# Author:          Drew Conway (drew.conway@nyu.edu) and John Myles White (jmw@johnmyleswhite.com)
# Purpose:         Code for Chapter 4.  In this case study we will attempt to write a "priority
#                   inbox" algorithm for ranking email by some measures of importance.  We will
#                   define these measures based on a set of email features, which moves beyond
#                   the simple word counts used in Chapter 3.
# Data Used:       Email messages contained in ../../03-Classification/code/data/
#                   source: http://spamassassin.apache.org/publiccorpus/
# Packages Used:   tm, ggplot2

# All source code is copyright (c) 2011, under the Simplified BSD License.  
# For more information on FreeBSD see: http://www.opensource.org/licenses/bsd-license.php

# All images and materials produced by this code are licensed under the Creative Commons 
# Attribution-Share Alike 3.0 United States License: http://creativecommons.org/licenses/by-sa/3.0/us/

# All rights reserved.

                                                   
# Load libraries
library(tm)
library(ggplot2)
library(plyr)

# Set the global paths

## INPUT EMAILS GO HERE
## this is the training data set... 
easyham.path <-"/Users/plim/Documents/node-upload/InnovationJam2016/PriorityInbox/data/easy_ham_2/“

## you can call it whatever you want, but only keep 1 file here
onetime.path <-"/Users/plim/Documents/node-upload/InnovationJam2016/PriorityInbox/data/inbox/"
onetime.fn   <-"/Users/plim/Documents/node-upload/InnovationJam2016/PriorityInbox/data/inbox/email.txt"

## OUTPUT GOES HERE
## this is the classification and training of emails... use this to pull test cases from.. .look up priority column and the path of the file to get the 'content'

output.fn5   <-“/Users/plim/Documents/node-upload/InnovationJam2016/PriorityInbox/output/finaldf.csv"


# We define a set of function that will extract the data
# for the feature set we have defined to rank email
# importance.  This includes the following: message
# body, message source, message subject, and date the
# message was sent.

# Simply returns the full text of a given email message
msg.full <- function(path) {
    con <- file(path, open = "rt", encoding = "latin1")
    msg <- readLines(con)
    close(con)
    return(msg)
}

# Retuns the email address of the sender for a given
# email message
get.from <- function(msg.vec) {
    from <- msg.vec[grepl("From: ", msg.vec)]
    from <- strsplit(from, '[":<> ]')[[1]]
    from <- from[which(from  != "" & from != " ")]
    return(from[grepl("@", from)][1])
}

# Retuns the subject string for a given email message
get.subject <- function(msg.vec) {
    subj <- msg.vec[grepl("Subject: ", msg.vec)]
    if(length(subj) > 0) {
        return(strsplit(subj, "Subject: ")[[1]][2])
    }
    else {
        return("")
    }
}

# Similar to the function from Chapter 3, this returns
# only the message body for a given email.
get.msg <- function(msg.vec) {
    msg <- msg.vec[seq(which(msg.vec == "")[1] + 1, length(msg.vec), 1)]
    return(paste(msg, collapse = "\n"))
}

# Retuns the date a given email message was received
get.date <- function(msg.vec) {
    date.grep <- grepl("^Date: ", msg.vec)
    date.grep <- which(date.grep == TRUE)
    date <- msg.vec[date.grep[1]]
    date <- strsplit(date, "\\+|\\-|: ")[[1]][2]
    date <- gsub("^\\s+|\\s+$", "", date)
    return(strtrim(date, 25))
}

# This function ties all of the above helper functions together.
# It returns a vector of data containing the feature set
# used to categorize data as priority or normal HAM
parse.email <- function(path) {
    full.msg <- msg.full(path)
    date <- get.date(full.msg)
    from <- get.from(full.msg)
    subj <- get.subject(full.msg)
    msg <- get.msg(full.msg)
    return(c(date, from, subj, msg, path))
}

# In this case we are not interested in classifiying SPAM or HAM, so we will take
# it as given that is is being performed.  As such, we will use the EASY HAM email
# to train and test our ranker.
easyham.docs <- dir(easyham.path)
easyham.docs <- easyham.docs[which(easyham.docs != "cmds")]
easyham.parse <- lapply(easyham.docs, function(p) parse.email(paste(easyham.path, p, sep = "")))

# Convert raw data from list to data frame
ehparse.matrix <- do.call(rbind, easyham.parse)
allparse.df <- data.frame(ehparse.matrix, stringsAsFactors = FALSE)
names(allparse.df) <- c("Date", "From.EMail", "Subject", "Message", "Path")

# Convert date strings to POSIX for comparison. Because the emails data
# contain slightly different date format pattners we have to account for
# this by passining them as required partmeters of the function. 
date.converter <- function(dates, pattern1, pattern2) {

		# broken: df$tm <- strptime(paste(dates, times), "%m/%d/%y %H:%M:%S")
		#working: df$tm <- as.POSIXct(strptime(paste(dates, times), "%m/%d/%y %H:%M:%S"))


    pattern1.convert <- as.POSIXct(strptime(dates, pattern1))
    pattern2.convert <- as.POSIXct(strptime(dates, pattern2))
    pattern1.convert[is.na(pattern1.convert)] <- pattern2.convert[is.na(pattern1.convert)]
    return(pattern1.convert)
}

pattern1 <- "%a, %d %b %Y %H:%M:%S"
pattern2 <- "%d %b %Y %H:%M:%S"

allparse.df$Date <- date.converter(allparse.df$Date, pattern1, pattern2)

# Convert emails and subjects to lower-case
allparse.df$Subject <- tolower(allparse.df$Subject)
allparse.df$From.EMail <- tolower(allparse.df$From.EMail)

# Order the messages chronologically
priority.df <- allparse.df[with(allparse.df, order(Date)),]

# We will use the first half of the priority.df to train our priority in-box algorithm.
# Later, we will use the second half to test.
priority.train <- priority.df[1:(round(nrow(priority.df)/2)),]

# The first step is to create rank weightings for all of the features.
# We begin with the simpliest: who the email is from.

# Calculate the frequency of correspondence with all emailers in the training set
from.weight <- ddply(priority.train, .(From.EMail), summarise, Freq = length(Subject))
from.weight <- from.weight[with(from.weight, order(Freq)),]

# We take a subset of the from.weight data frame to show our most frequent 
# correspondents.
from.ex <- subset(from.weight, Freq>6)

# Log weight scheme, very simple but effective
from.weight <- transform(from.weight, Weight = log(Freq + 1), log10Weight = log10(Freq + 1))   

# To calculate the rank priority of an email we should calculate some probability that 
# the user will respond to it.  In our case, we only have one-way communication data.
# In this case, we can calculate a weighting based on words in threads that have a lot
# of activity.

# This function is used to find threads within the data set.  The obvious approach
# here is to use the 're:' cue from the subject line to identify message threads.
find.threads <- function(email.df) {
    response.threads <- strsplit(email.df$Subject, "re: ")
    is.thread <- sapply(response.threads, function(subj) ifelse(subj[1] == "", TRUE, FALSE))
    threads <- response.threads[is.thread]
    senders <- email.df$From.EMail[is.thread]
    threads <- sapply(threads, function(t) paste(t[2:length(t)], collapse = "re: "))
    return(cbind(senders,threads))
}

threads.matrix <- find.threads(priority.train)

# Using the matrix of threads generated by the find.threads function this function
# creates a data from of the sender's email, the frequency of emails from that
# sender, and a log-weight for that sender based on the freqeuncy of corresponence.
email.thread <- function(threads.matrix) {
    senders <- threads.matrix[,1]
    senders.freq <- table(senders)
    senders.matrix <- cbind(names(senders.freq), senders.freq, log(senders.freq+1))
    senders.df <- data.frame(senders.matrix, stringsAsFactors=FALSE)
    row.names(senders.df) <- 1:nrow(senders.df)
    names(senders.df) <- c("From.EMail", "Freq", "Weight")
    senders.df$Freq <- as.numeric(senders.df$Freq)
    senders.df$Weight <- as.numeric(senders.df$Weight)
    return(senders.df)
}

senders.df <- email.thread(threads.matrix)

# As an additional weight, we can enhance our notion of a thread's importance
# by measuring the time between responses for a given email.  This function
# takes a given thread and the email.df data frame to generate a weighting 
# based on this activity level.  This function returns a vector of thread
# activity, the time span of a thread, and its log-weight.
thread.counts <- function(thread, email.df) {
    # Need to check that we are not looking at the original message in a thread, 
    # so we check the subjects against the 're:' cue.
    thread.times <- email.df$Date[which(email.df$Subject == thread | 
            email.df$Subject == paste("re:", thread))]
    freq <- length(thread.times)
    min.time <- min(thread.times)
    max.time <- max(thread.times)
    time.span <- as.numeric(difftime(max.time, min.time, units="secs"))
    if(freq < 2) {
        return(c(NA,NA,NA))
    }
    else {
        trans.weight <- freq/time.span
        log.trans.weight <- 10+log(trans.weight, base=10)
        return(c(freq, time.span, log.trans.weight))
    }
}

# This function uses the threads.counts function to generate a weights
# for all email threads.
get.threads <- function(threads.matrix, email.df) {
    threads <- unique(threads.matrix[,2])
    thread.counts <- lapply(threads, function(t) thread.counts(t, email.df))
    thread.matrix <- do.call(rbind, thread.counts)
    return(cbind(threads, thread.matrix))
}

# Now, we put all of these function to work to generate a training set
# based on our thread features.
thread.weights <- get.threads(threads.matrix, priority.train)
thread.weights <- data.frame(thread.weights, stringsAsFactors=FALSE)
names(thread.weights) <- c("Thread","Freq","Response","Weight")
thread.weights$Freq <- as.numeric(thread.weights$Freq)
thread.weights$Response <- as.numeric(thread.weights$Response)
thread.weights$Weight <- as.numeric(thread.weights$Weight)
thread.weights <- subset(thread.weights, is.na(thread.weights$Freq) == FALSE)


# Similar to what we did in Chapter 3, we create a simple function to return a 
# vector of word counts.  This time, however, we keep the TDM as a free
# parameter of the function.
term.counts <- function(term.vec, control) {
    vec.corpus <- Corpus(VectorSource(term.vec))
    vec.tdm <- TermDocumentMatrix(vec.corpus, control = control)
    return(rowSums(as.matrix(vec.tdm)))
}

thread.terms <- term.counts(thread.weights$Thread, control = list(stopwords = stopwords()))
thread.terms <- names(thread.terms)

term.weights <- sapply(thread.terms, function(t) mean(thread.weights$Weight[grepl(t, thread.weights$Thread, fixed=TRUE)]))
term.weights <- data.frame(list(Term = names(term.weights), Weight = term.weights), stringsAsFactors = FALSE, 
    row.names = 1:length(term.weights))

# Finally, create weighting based on frequency of terms in email. 
# Will be similar to SPAM detection, but in this case weighting
# high words that are particularly HAMMMY.

msg.terms <- term.counts(priority.train$Message, control = list(stopwords=stopwords(),
    removePunctuation = TRUE, removeNumbers = TRUE))
msg.weights <- data.frame(list(Term = names(msg.terms), Weight = log(msg.terms, base = 10)), stringsAsFactors = FALSE,
    row.names = 1:length(msg.terms))

# Remove words that have a zero weight
msg.weights <- subset(msg.weights, Weight > 0)

# This function uses our pre-calculated weight data frames to look up
# the appropriate weightt for a given search.term.  We use the 'term'
# parameter to dertermine if we are looking up a word in the weight.df
# for it message body weighting, or for its subject line weighting.
get.weights <- function(search.term, weight.df, term = TRUE) {
    if(length(search.term) > 0) {
        if(term) {
            term.match <- match(names(search.term), weight.df$Term)
        }
        else {
            term.match <- match(search.term, weight.df$Thread)
        }
        match.weights <- weight.df$Weight[which(!is.na(term.match))]
        if(length(match.weights) < 1) {
            return(1)
        }
        else {
            return(mean(match.weights))
        }
    }
    else {
        return(1)
    }
}

# Our final step is to write a function that will assign a weight to each message based
# on all of our, we create a function that will assign a weight to each message based on
# the mean weighting across our entire feature set.
rank.message <- function(path) {
    msg <- parse.email(path)
    # Weighting based on message author
    
    # First is just on the total frequency
    from <- ifelse(length(which(from.weight$From.EMail==msg[2])) > 0,
        from.weight$Weight[which(from.weight$From.EMail==msg[2])], 1)
    
    # Second is based on senders in threads, and threads themselves
    thread.from <- ifelse(length(which(senders.df$From.EMail==msg[2])) > 0,
        senders.df$Weight[which(senders.df$From.EMail==msg[2])], 1)
        
    subj <- strsplit(tolower(msg[3]), "re: ")
    is.thread <- ifelse(subj[[1]][1]=="", TRUE, FALSE)
    if(is.thread) {
        activity <- get.weights(subj[[1]][2], thread.weights, term=FALSE)
    }
    else {
        activity <- 1
    }
    
    # Next, weight based on terms    
    
    # Weight based on terms in threads
    thread.terms <- term.counts(msg[3], control=list(stopwords=stopwords()))
    thread.terms.weights <- get.weights(thread.terms, term.weights)
    
    # Weight based terms in all messages
    msg.terms <- term.counts(msg[4], control=list(stopwords=stopwords(),
        removePunctuation=TRUE, removeNumbers=TRUE))
    msg.weights <- get.weights(msg.terms, msg.weights)
    
    # Calculate rank by interacting all weights
    rank <- prod(from, thread.from, activity, 
        thread.terms.weights, msg.weights)
    
    return(c(msg[1], msg[2], msg[3], rank))
}

# Find splits again
train.paths <- priority.df$Path[1:(round(nrow(priority.df) / 2))]
test.paths <- priority.df$Path[((round(nrow(priority.df) / 2)) + 1):nrow(priority.df)]

# Now, create a full-featured training set.
train.ranks <- lapply(train.paths, rank.message)
train.ranks.matrix <- do.call(rbind, train.ranks)
train.ranks.matrix <- cbind(train.paths, train.ranks.matrix, "TRAINING")
train.ranks.df <- data.frame(train.ranks.matrix, stringsAsFactors = FALSE)
names(train.ranks.df) <- c("Message", "Date", "From", "Subj", "Rank", "Type")
train.ranks.df$Rank <- as.numeric(train.ranks.df$Rank)

# Set the priority threshold to the median of all ranks weights
priority.threshold <- median(train.ranks.df$Rank)

# Classify as priority, or not
train.ranks.df$Priority <- ifelse(train.ranks.df$Rank >= priority.threshold, 1, 0)

# Now, test our ranker by performing the exact same procedure on the test data
test.ranks <- suppressWarnings(lapply(test.paths,rank.message))
test.ranks.matrix <- do.call(rbind, test.ranks)
test.ranks.matrix <- cbind(test.paths, test.ranks.matrix, "TESTING")
test.ranks.df <- data.frame(test.ranks.matrix, stringsAsFactors = FALSE)
names(test.ranks.df) <- c("Message","Date","From","Subj","Rank","Type")
test.ranks.df$Rank <- as.numeric(test.ranks.df$Rank)
test.ranks.df$Priority <- ifelse(test.ranks.df$Rank >= priority.threshold, 1, 0)

# Finally, we combine the data sets.
final.df <- rbind(train.ranks.df, test.ranks.df)
final.df$Date <- date.converter(final.df$Date, pattern1, pattern2)
final.df <- final.df[rev(with(final.df, order(Date))),]

# Save final data set and plot results.
write.csv(final.df, output.fn5, row.names=FALSE)

### this is the new one time logic

evaluate.msg <- function(emailBody) {

		fileConn<-file(onetime.fn)
		writeLines(emailBody, fileConn)
		close(fileConn)

		onetime.docs <- dir(onetime.path)
		onetime.parse <- lapply(onetime.docs, function(p) parse.email(paste(onetime.path, p, sep = "")))
		
		onetime.paths <- onetime.parse[[1]][5]
		
		test.ranks <- suppressWarnings(lapply(onetime.paths,rank.message))
		test.ranks.matrix <- do.call(rbind, test.ranks)
		test.ranks.matrix <- cbind(test.paths, test.ranks.matrix, "TESTING")
		test.ranks.df <- data.frame(test.ranks.matrix, stringsAsFactors = FALSE)
		names(test.ranks.df) <- c("Message","Date","From","Subj","Rank","Type")
		test.ranks.df$Rank <- as.numeric(test.ranks.df$Rank)
		test.ranks.df$Priority <- ifelse(test.ranks.df$Rank >= priority.threshold, 1, 0)
		
		# 1 means important ... it's output to the console
		test.ranks.df$Priority

    return(paste(test.ranks.df$Priority))
}




