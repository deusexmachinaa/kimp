"use client";
import React, { useState, useEffect } from "react";
import { sendMessage, subscribeToMessages } from "@/api/chat";
import { Message } from "../types";

const ChatComponent = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([] as Message[]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(setMessages);

    // Unsubscribe from the messages when the component unmounts
    return unsubscribe;
  }, []);

  const handleSend = () => {
    sendMessage(messageText);
    setMessageText("");
  };

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <p>
            {message.displayName}: {message.text}
          </p>
        </div>
      ))}
      <input
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatComponent;
