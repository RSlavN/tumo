import express from "express";
import { readFileSync, writeFileSync, appendFileSync} from 'fs';
const app = express();

app.use(express.static('.'));
app.use(express.json());

app.post("/api/registration", (req, res) => {
    let text = readFileSync("registered.txt", "utf8");
    console.log(req.body);
    if(text.match(req.body.email) == null && req.body.password.length > 8){
        appendFileSync('registered.txt', JSON.stringify(req.body) + "\n")
    }   
});


app.listen(3000, function(){
    console.log("Екземпляр запущено через порт 3000");
    });