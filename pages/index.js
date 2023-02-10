import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const bottomRef = useRef(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);

  //set the first message on load
  useEffect(() => {
    setMessages([{ name: "AI", message: getGreeting() }]);
  }, [0]);

  //scroll to the bottom of the chat for new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function getGreeting() {
    const greetings = [
      "Hi there! How's your day going? I've been feeling particularly grateful for the delicious meals I've been able to enjoy lately. How about you?",
      "Good morning! I hope you're having a great start to your day. I'm feeling grateful for the beautiful nature around me, it always helps me to feel at peace. What are you thankful for today?",
      "Hello! I'm grateful for the laughter and joy that my loved ones bring me. What are you grateful for today?",
      "Hey, How's it going? Today, I'm grateful for the simple things in life like a warm bed and a good book. What are you grateful for today?",
      "Hi, how are you? I'm feeling grateful for the memories I've made with friends and family. Is there anything you're grateful for today?",
    ];
    const index = Math.floor(greetings.length * Math.random());
    return greetings[index];
  }

  async function onSubmit(event) {
    event.preventDefault();

    //start AI message before call
    //this is a hack, the state doesn't update before the api call,
    //so I reconstruct the messages
    setMessages((prevMessages) => {
      const newMessages = [
        ...prevMessages,
        { name: "Me", message: chatInput },
        { name: "AI", message: "" },
      ];
      return newMessages;
    });

    const sentInput = chatInput;
    setChatInput("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat: [...messages, { name: "Me", message: sentInput }],
      }),
    });

    if (!response.ok) {
      alert("Please enter a valid input");
      return;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    //stream in the response
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      setMessages((prevMessages) => {
        const lastMsg = prevMessages.pop();
        const newMessages = [
          ...prevMessages,
          { name: lastMsg.name, message: lastMsg.message + chunkValue },
        ];
        return newMessages;
      });
    }
  }

  const messageElements = messages.map((m, i) => {
    return (
      <div
        style={{
          background: m.name === "AI" ? "none" : "rgb(0 156 23 / 20%)",
        }}
        key={i}
        className={styles.message}
      >
        <div className={styles.messageName}>{m.name}</div>
        <div className={styles.messageContent}> {m.message}</div>
      </div>
    );
  });

  return (
    <div>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
          margin: 0px;
        }
      `}</style>
      <Head>
        <title>🙏GratitudeGPT</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <h3>🙏GratitudeGPT</h3>
        <div className={styles.chat}>
          <div className={styles.chatDisplay}>
            {messageElements}

            <div ref={bottomRef} />
          </div>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="chat"
              placeholder="Write here"
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
              }}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className={styles.footer}>
          made by <a href="http://whichlight.com">whichlight</a>
        </div>
      </main>
    </div>
  );
}
