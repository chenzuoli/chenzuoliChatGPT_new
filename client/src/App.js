import "./normal.css";
import "./App.css";
import { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import ChatBox from "./ChatBox";

function App() {
  const [chatInput, setChatInput] = useState("");
  const [temperature, setTemperature] = useState(0.5);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  //const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);

  // clear chats
  function clearChat() {
    setChatLog([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, { user: "me", message: `${chatInput}` }];
    setChatInput("");
    setChatLog(chatLogNew);
    // fetch response to the api combining the chat log array of messages and seinding it as a message to localhost:3000 as a post
    const messages = chatLogNew.map((message) => message.message).join("\n");

    //const response = await fetch("https://express-demo-gamma.vercel.app/", {
    //const response = await fetch("https://chatapi-theta.vercel.app:3080", {
    //const response = await fetch("http://localhost:3080", {
    const response = await fetch("http://43.153.35.39:3080", {
    //const response = await fetch("https://chatapi-chenzuoli.vercel.app/", {
    //const response = await fetch("https://chatapi-new.vercel.app/", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify({
       message: messages,
       currentModel,
     }),
    });
    const data = await response.json();
    console.log('response: ' + data)
    // let msg = "我的好兄弟是白璐，他是一个职业投资人\n我的妻子是邓佳滢，她是文化行业从业者\n我有许多个博客网站，一般在github pages上写的比较全，另外csdn和知乎偶尔写一些，记录一些可能经常用到的东西，后面可以自己查看。\nhttps://chenzuoli.github.io/\nhttps://blog.csdn.net/chenzuoli\nhttps://www.zhihu.com/people/nihaoshijie709918\n我的微信公众号：程序员写书，里面最近记录的是关于商业的知识，欢迎关注👏🏻\n学习股票交易中，也在学习AIGC、ChatGPT，不想被AI替代\n这是我的个人简历：https://chenzuoli.github.io/2021/09/27/%E4%B8%AA%E4%BA%BA%E7%AE%80%E5%8E%86/"
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    var scrollToTheBottomChatLog =
      document.getElementsByClassName("chat-log")[0];
    scrollToTheBottomChatLog.scrollTop = scrollToTheBottomChatLog.scrollHeight;
  }

  function handleTemp(temp) {
    if (temp > 1) {
      setTemperature(1);
    } else if (temp < 0) {
      setTemperature(0);
    } else {
      setTemperature(temp);
    }
  }

  return (
    <div className="App">
      <SideMenu
        setTemperature={handleTemp}
        temperature={temperature}
        clearChat={clearChat}
      />
      <ChatBox
        chatInput={chatInput}
        chatLog={chatLog}
        setChatInput={setChatInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
