import express from "express";

const port = 3001;
const app = express();

app.use(express.text({ type: "application/x-www-form-urlencoded" }));

const checkUsernameHeader = (req, res, next) => {
  const usernameHeader = req.get("X-Username");
  usernameHeader ? (req.username = usernameHeader) : (req.username = null);
  next();
};

const validateJsonArrayBody = (req, res, next) => {
  if (!req.body || req.body.trim() === "") {
    req.parsedBody = [];
    return next();
  }

  try {
    const parsed = JSON.parse(req.body);
    if (!Array.isArray(parsed)) {
      return res.status(400).send("Body must be an array.");
    }

    const allElementsAreStrings = parsed.every(
      (item) => typeof item === "string",
    );
    if (!allElementsAreStrings) {
      return res.status(400).send("Array elements must be strings");
    }

    req.parsedBody = parsed;
    next();
  } catch (error) {
    return res.status(400).send("Invalid JSON");
  }
};

app.post("/", checkUsernameHeader, validateJsonArrayBody, (req, res) => {
  const { username, parsedBody } = req;
  const count = parsedBody.length;

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
});

app.listen(port, () => {
  console.log(
    `custom-written-middleware exercise server running at port: ${port}`,
  );
});
