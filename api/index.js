
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const operandClient = require("@operandinc/sdk").operandClient;
const OperandService = require("@operandinc/sdk").OperandService;

// Open AI Configuration
const configuration = new Configuration({
  apiKey: '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'
});

const openai = new OpenAIApi(configuration);

// Express Configuration
const app = express();
const port = 3080;

app.use(bodyParser.json());
app.use(cors());
app.use(require("morgan")("dev"));

// Routing
// Primary Open AI Route
app.post("/", async (req, res) => {
  const { message } = req.body;

  const runIndex = async () => {
    const operand = operandClient(
      OperandService,
      "Key pdo75w61w4pw8tjc1y7ecox1s1ahv8ss",
      "https://mcp.operand.ai"
    );

    try {
      const results = await operand.search({
        query: `${message}`,
        parentId: "",
        maxResults: 3
      });

      if (results) {
        return results.matches.map((m) => `- ${m.content}`).join("\n");
      } else {
        return "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  let operandSearch = await runIndex(message);

  const basePromptPrefix = `This is a conversation between bloger Chenzuoli and a stranger.\nRelevant information that Chenzuoli knows:\n${operandSearch}`;
  console.log(basePromptPrefix)

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${basePromptPrefix}\n\nStranger:${message}\n\nChenzuoli:`,
    max_tokens: 256,
    temperature: 0.7,
  });
  res.json({
    message: response.data.choices[0].text,
  });
});

// Get Models Route

// Start the server
app.listen(port, () => {
  console.log(`server running.`);
});

module.exports = app;
