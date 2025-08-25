import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./chatHeader";
import { formatMessageTime } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";

function ChatContainer() {
  const { messages, getMessages, isMessagesLoading, selectedUser,subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    subscribeToMessages();

    return ()=> unsubscribeFromMessages();

  }, [selectedUser?._id, getMessages,subscribeToMessages,unsubscribeFromMessages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSentByAuthUser =
            String(message.senderId) === String(authUser?._id);

          return (
            <div
              key={message._id}
              className={`chat ${isSentByAuthUser ? "chat-end" : "chat-start"}`}
            >
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSentByAuthUser
                        ? authUser?.profilePic || "/avatar.png"
                        : selectedUser?.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Message Header */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message Content */}
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
        {/* Empty div to always scroll into view */}
        <div ref={messageEndRef}></div>
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer;
