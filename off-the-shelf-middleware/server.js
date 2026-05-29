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
    const parsedBody = req.body || [];
    const count = parsedBody.length;

    const username = req.username;

    const subjectWord = count === 1 ? "subject" : "subjects";
    const subjectsList = count > 0 ? `: ${parsedBody.join(", ")}` : "";

    let responseMessage = "";

    if (username) {
        responseMessage += `You are authenticated as ${username}.\n\n`;
    } else {
        responseMessage += `You are not authenticated.\n\n`;
    }

    responseMessage += `You have requested information about ${count} ${subjectWord}${subjectsList}`;

    res.send(responseMessage);
})


app.listen(port, () => {
    console.log(`custom-written-middleware exercise server running at port: ${port}`);
})