let express = require("express");
let path = require("path");
let fs = require("fs");
let logger = require("morgan");
let app = express();
let PORT = process.env.PORT || 3000;
let noteHolder = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static("public"));

// api routes
app.get("/api/notes/", function (req, res) {
    fs.readFile(__dirname + '/db/db.json', 'utf8', function (err, data) {
        let notes = [];
        if(err){throw err;}
        if(data.length)
        {
            notes = JSON.parse(data);
            console.log(notes);
            console.log("/api/notes");
            res.send(notes);
        }else{ console.log("error reading db.json file");}
    });
});

// Receive a new note to save on the request body, add it to the `db.json` file, 
// and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    console.log(newNote);
    console.log("app.post");
    noteHolder.push(newNote);
    console.log(newNote);
    res.json(newNote);
    fs.writeFile('')
});

// html routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


