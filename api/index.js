
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Open AI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
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
  // console.log("OpenAI API Key: " + process.env.OPENAI_API_KEY);

  const { message } = req.body;
  console.log(req + ":" + `${message}`)

  let basePrompt = "我有许多个博客网站，一般在github pages上写的比较全，另外csdn和知乎偶尔写一些，记录一些可能经常用到的东西，后面可以自己查看。\nhttps://chenzuoli.github.io/\nhttps://blog.csdn.net/chenzuoli\nhttps://www.zhihu.com/people/nihaoshijie709918\n我的微信公众号：程序员写书，里面最近记录的是关于商业的知识，欢迎关注👏🏻\n学习股票交易中，也在学习AIGC、ChatGPT，不想被AI替代\n最近在做AI相关的项目,想帮助那些恐惧AI的人,不被替代.\n这是我的个人简历：https://chenzuoli.github.io/2021/09/27/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86/";

  const basePromptPrefix = `This is a conversation between bloger Chenzuoli and a stranger.\nRelevant information that Chenzuoli knows:\n${basePrompt}`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    //model: "gpt-3.5-turbo",
    prompt: `${basePromptPrefix}\n\nStranger:${message}\n\nChenzuoli:`,
    max_tokens: 1024,
    temperature: 0.7
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
