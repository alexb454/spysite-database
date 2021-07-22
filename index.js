const express = require('express');
const path = require('path');
const db = require('./queries')
let app = express();

const theport = 3016

app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'));
app.get('/', (request, response)=> {
    response.sendFile(path.join(__dirname, "/spy.html"));
});

app.post('/info', db.sendInfo);
app.get('/spy', db.getInfoAgent);
app.get('/forusonly', db.getAgent)
app.get('/forusonly', db.getStructureS)
app.get('/forusonly', db.getStructureQ)


app.listen(theport, ()=>{
    console.log(`Server is on this serect spy net hehe http://localhost:${theport}`)
})