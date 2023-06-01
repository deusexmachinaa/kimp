"use client";
import React, { useState, useEffect, useContext } from "react";
import { sendMessage, subscribeToMessages } from "@/api/chat";
import { Message } from "../types";
import { AuthContext } from "../AuthProvider";

const ChatComponent = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([] as Message[]);
  const authContext = useContext(AuthContext);
  useEffect(() => {
    const unsubscribe = subscribeToMessages(setMessages);

    // Unsubscribe from the messages when the component unmounts
    return unsubscribe;
  }, []);
  if (!authContext) {
    return <div>Loading...</div>;
  }
  const { userCount } = authContext;

  const handleSend = () => {
    sendMessage(messageText);
    setMessageText("");
  };

  return (
    <>
      <div>Currently, {userCount} users are online.</div>
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
    </>
  );
};

export default ChatComponent;
