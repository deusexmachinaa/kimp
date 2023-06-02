"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { loadMoreMessages, sendMessage, subscribeToMessages } from "@/api/chat";
import "tailwindcss/tailwind.css";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { Message } from "@/app/types";
import { AuthContext } from "@/app/AuthProvider";
import { nickNameState, useOptionsStore } from "./Header";

const ChatComponent = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([] as Message[]);

  const authContext = useContext(AuthContext);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [lastVisible, setLastVisible] = useState<Message | null>(null);
  const [isChatMinimized, setChatMinimized] = useState(false);
  const { userCount } = authContext!;
  const isMaximized = useOptionsStore((state) => state.isMaximized);
  const { nickname, setNickname } = nickNameState();

  // 첫 로드 시 사용자의 displayName을 nickname state에 저장
  useEffect(() => {
    setNickname(authContext?.currentUser?.displayName || "익명의 사용자");
  }, [authContext?.currentUser?.displayName]);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      // 가장 최근의 30개 메시지만 표시
      setMessages(newMessages.slice(-30));
    });
    // Unsubscribe from the messages when the component unmounts
    return unsubscribe;
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current!.scrollIntoView();
  };

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (!bottom) {
      setIsAtBottom(false);
    }
    // Check if scrolled to top
    if (target.scrollTop === 0) {
      const oldScrollHeight = target.scrollHeight;
      const { moreMessages, newLastVisible } = await loadMoreMessages(
        lastVisible
      );
      setMessages((prevMessages) => [...moreMessages, ...prevMessages]);
      setLastVisible(newLastVisible);

      requestAnimationFrame(() => {
        target.scrollTop = target.scrollHeight - oldScrollHeight;
      });
    }
    if (!messagesContainerRef.current) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const atBottom = scrollHeight - (scrollTop + clientHeight) < 10;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (!isChatMinimized) {
      scrollToBottom();
    }
  }, [isChatMinimized]);

  const handleSend = () => {
    if (messageText.trim() !== "") {
      sendMessage(messageText);
      setMessageText("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const toggleChat = () => {
    setChatMinimized(!isChatMinimized);
  };

  // 닉네임 업데이트 함수
  const updateNickname = async () => {
    const newNickname = prompt("변경할 닉네임을 입력해주세요");
    if (newNickname) {
      try {
        await updateProfile(authContext?.currentUser!, {
          displayName: newNickname,
        });
        setNickname(newNickname);
      } catch (error) {
        console.error("Error updating nickname:", error);
      }
    }
  };
  return (
    <>
      {isChatMinimized ? (
        <div
          className="fixed right-5 bottom-5 pb-safe-0 z-40 inline-block cursor-pointer"
          onClick={toggleChat}
        >
          <div className="flex items-center justify-center w-14 h-14 lg:w-20 rounded-lg shadow-lg bg-gray-200 opacity-50 hover:opacity-100">
            <i className="fas fa-comments text-black"></i>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-0 bg-gray-50 dark:bg-black w-full fixed left-0 lg:left-auto bottom-0 pb-safe-0 right-0 z-40 flex flex-col lg:right-6 lg:shadow-lg lg:rounded-lg  lg:bottom-6 inline-block lg:w-80">
          <div className="flex-shrink-0 flex items-center px-3 py-1.5 lg:py-3 lg:px-3 cursor-pointer shadow border-b border-gray-100 dark:border-b-0 z-10 select-none">
            <h3 className="font-gilroy text-primary">
              Kimp
              <strong className="ml-px text-gray-800 dark:text-gray-100">
                Site
              </strong>
            </h3>
            <span className="text-gray-300 dark:text-gray-500 mx-2">
              <i
                aria-hidden="true"
                className="fas fa-chevron-down"
                onClick={toggleChat}
              ></i>
            </span>
            <span className="flex-1"></span>
            <span
              className="text-sm text-primary cursor-pointer underline whitespace-nowrap overflow-ellipsis overflow-x-hidden mx-3 truncate"
              title="닉네임 변경하려면 클릭하세요"
              onClick={updateNickname}
            >
              {nickname}
            </span>
            <span
              className="text-gray-300 dark:text-gray-500 mx-2"
              title="접속자 수"
            >
              {userCount}
            </span>
          </div>
          <div className="relative">
            <div
              className={`flex-1 overflow-x-hidden overflow-y-auto p-2 scroll-hidden bg-white dark:bg-black overscroll-y-contain relative ${
                isMaximized ? "h-[80vh]" : "max-h-72 lg:max-h-96"
              }`}
              onScroll={handleScroll}
              ref={messagesContainerRef}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`my-0.5 ${
                    authContext?.currentUser?.uid === message.uid
                      ? "text-right"
                      : ""
                  }`}
                >
                  <div className="text-sm lg:text-xs text-gray-600 dark:text-gray-400 mt-2.5 mb-1 inline-flex items-center space-x-1.5 hover:text-gray-400 dark:hover:text-gray-200">
                    <span className="flex items-center space-x-1  select-none">
                      <span>{message.displayName}</span>
                      {/* {authContext?.currentUser?.uid === message.uid && (
                        <span className="ml-1 text-gray-400 dark:text-gray-600 text-xxs">
                          LVE
                        </span>
                      )} */}
                      {/* <span className="">
                        <i
              aria-hidden="true"
              className="fas fa-ban text-gray-200 dark:text-gray-600 ml-1.5"
            ></i>
                      </span> */}
                    </span>
                  </div>
                  <div
                    className={`flex ${
                      authContext?.currentUser?.uid === message.uid
                        ? "flex-row-reverse"
                        : ""
                    } items-end text-sm lg:text-xs rounded`}
                  >
                    <span className="py-1.5 px-2 rounded break-all bg-gray-100 dark:bg-gray-800 text-left">
                      {message.text}
                    </span>
                    <span className="mx-1.5 mb-0.5 text-xs whitespace-nowrap text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
            {!isAtBottom && (
              <div
                className="absolute bottom-8 right-6 text-white dark:text-gray-900 bg-primary shadow cursor-pointer w-12 h-12 rounded-full flex items-center justify-center text-lg transition-opacity pt-0.5 bg-green-500 opacity-50 hover:opacity-100"
                onClick={scrollToBottom}
              >
                <i aria-hidden="true" className="fas fa-chevron-down"></i>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center p-2 border-t border-gray-200 dark:border-gray-900">
            <span className="flex-1 py-1.5 lg:py-0.5 px-2 mr-1.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-0">
              <input
                type="text"
                className="w-full text-sm lg:text-xs text-gray-800 dark:text-white"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={200}
                placeholder="메시지를 입력하세요 (최대 200자)"
              />
            </span>
            <i
              aria-hidden="true"
              className={`fas fa-paper-plane px-3 py-1.5 cursor-pointer ${
                messageText.trim() !== ""
                  ? "text-green-500"
                  : "text-gray-400 dark:text-gray-600"
              }`}
              onClick={handleSend}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatComponent;
