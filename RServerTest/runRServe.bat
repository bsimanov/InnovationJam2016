# start server -- this will block with Rserve is starte
# "c:\Program Files\R\R-3.2.5\bin\R.exe" -f ex6.R --gui-none --no-save

# because we run run.Rserve() the current session will become Rserve session
# so we can initialize the server here

# here goes some code you want to load once for example an echo function
echo <- function(data) {
    print(data)
    return(data);
}

# then run Rserve in process
require('Rserve')
run.Rserve()