import  { useState, useRef, useEffect } from "react";
import { Copy, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { motion, AnimatePresence } from "framer-motion";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export function ChatPage() {
  const [messages, setMessages] = useState([{
      role: "bot",
      content: "Hello! I am your AI-DSA Assistant. Ask me any DSA-related question and I'll guide you in detail.",
    },]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/aichat`, {
        message: input,
      });
      const botMessage = { role: "bot", content: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error: Could not fetch response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen text-white bg-gray-900/90 backdrop-blur-sm border-l border-r border-gray-700">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center gap-3 p-4 border-b border-b-emerald-400 bg-blue-600">
        <div className="w-15 h-15 rounded-full bg-red-500 flex items-center justify-center">🤖</div>
        <div>
          <div className="font-semibold text-white">AI-DSA Assistant ChatBot</div>
          <div className="text-2xl text-green-400">Online</div>
        </div>
      </div>

  {/* Chat body */}
<div className="flex-1 overflow-y-auto pt-16 px-4 mb-28 flex flex-col gap-4 mt-16">
  <AnimatePresence>
    {messages.map((msg, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`p-3 rounded-2xl max-w-[80%] break-words ${
          msg.role === "user"
            ? "bg-pink-600 text-white self-end"
            : "bg-gray-700 text-gray-100 self-start"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs opacity-70">{msg.role === "user" ? "You" : "Assistant"}</span>
          {msg.role === "bot" && (
            <button
              onClick={() => copyToClipboard(msg.content)}
              className="text-xs flex items-center gap-1 hover:text-yellow-400"
            >
              <Copy size={12} /> Copy
            </button>
          )}
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {msg.content}
        </ReactMarkdown>
      </motion.div>
    ))}

    {/* Show typing indicator only when loading */}
    {loading && (
      <motion.div
        key="loading"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl animate-pulse self-start"
      >
        Assistant is typing...
      </motion.div>
    )}

    <div ref={messagesEndRef} />
  </AnimatePresence>
</div>


      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 border-t border-gray-700 bg-gray-900/90">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-gray-700 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none max-h-32"
            rows={1}
            placeholder="Ask me about DSA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mb-1"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
