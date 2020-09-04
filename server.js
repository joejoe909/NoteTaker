let express = require("express");
let path = require("path");
let fs = require("fs");
let logger = require("morgan");
let app = express();
const { v4: uuidv4 } = require("uuid");
uuidv4();
let PORT = process.env.PORT || 3000;
let notesHolder; //we will fill this in with data from db.json

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(express.static("public"));

// api routes
app.get("/api/notes/", function (req, res) {
    fs.readFile(__dirname + '/db/db.json', 'utf8', function (err, data) {
        if(err){throw err;}
        if(data.length)
        {
            notesHolder = JSON.parse(data);
            console.log(notesHolder);
            console.log("/api/notes");
            res.json(notesHolder);
        }else{ console.log("error reading db.json file");}
    });
});

// Receive a new note to save on the request body, add it to the `db.json` file, 
// and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    let newNote = { id: uuidv4(), ...req.body};
    console.log(newNote);
    console.log("app.post");
    notesHolder.push(newNote);
    console.log(newNote);
    res.json(notesHolder);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notesHolder), 'utf8', (err) => {
        if (err) { throw err; }
        console.log("saved to db.json");
    });
});


app.delete("/api/notes/:id", async function(req, res){
    try{ 
        const {id} = req.params;
                const data = await fs.promises.readFile(__dirname + "/db/db.json", "utf8");
                let notes = JSON.parse(data);
                notes = notes.filter((note) => note.id !== id );
                const strData = JSON.stringify(notes, null, 2);
                await fs.promises.writeFile(__dirname + "/db/db.json", strData);
                res.json(true);
        }catch(err){
            res.status(500).end()
        };
})

// html routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


