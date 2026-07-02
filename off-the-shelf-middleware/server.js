import express from "express";


const port = 3002;
const app = express();

app.use(express.json());

const checkUsernameHeader = (req, res, next) => {
    const usernameHeader = req.get("X-Username");
    req.username = usernameHeader? usernameHeader : null;
    next();
}

app.post("/", checkUsernameHeader, (req, res) => {
    const username = req.username;

    if (!username) return res.status(401).send("You are not authenticated.");

    const parsedBody = req.body || [];
    const count = parsedBody.length;

    const subjectWord = count === 1 ? "subject" : "subjects";
    const subjectsList = count > 0 ? `: ${parsedBody.join(", ")}` : "";

    let responseMessage = `You are authenticated as ${username}.\n\n`;
    
    responseMessage += `You have requested information about ${count} ${subjectWord}${subjectsList}`;

    res.send(responseMessage);
})


app.listen(port, () => {
    console.log(`custom-written-middleware exercise server running at port: ${port}`);
})
