'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('prompt', inputText);

            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            const botMessage = {
                id: Date.now() + 1,
                text: data.response || data.message || 'No response received',
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
            
            const errorMessage = {
                id: Date.now() + 1,
                text: `Error: ${error.message}`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString(),
                isError: true
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="min-h-screen p-4 bg-gray-50 flex items-center w-full">
            <div className="w-full max-w-4xl mx-auto h-[80vh]">
                <Card className="h-full flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Chat with Local Llama</CardTitle>
                                <CardDescription>
                                    Powered by Ollama - Ask me anything!
                                </CardDescription>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={clearChat}
                                disabled={messages.length === 0}
                            >
                                Clear Chat
                            </Button>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col space-y-4">
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-4 min-h-[300px]">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-500 mt-8">
                                        <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                                        <p>Start a conversation with your local Llama model!</p>
                                    </div>
                                )}
                                
                                {messages.map((message) => (
                                    <div 
                                        key={message.id} 
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            <div className={`p-2 rounded-full ${message.sender === 'user' ? 'bg-blue-500' : message.isError ? 'bg-red-500' : 'bg-gray-500'}`}>
                                                {message.sender === 'user' ? 
                                                    <User className="h-4 w-4 text-white" /> : 
                                                    <Bot className="h-4 w-4 text-white" />
                                                }
                                            </div>
                                            <div className={`p-3 rounded-lg ${
                                                message.sender === 'user' 
                                                    ? 'bg-blue-500 text-white' 
                                                    : message.isError 
                                                        ? 'bg-red-100 border border-red-300 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                                <span className={`text-xs mt-1 block ${
                                                    message.sender === 'user' 
                                                        ? 'text-blue-100' 
                                                        : message.isError 
                                                            ? 'text-red-600'
                                                            : 'text-gray-500'
                                                }`}>
                                                    {message.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start space-x-2">
                                            <div className="p-2 rounded-full bg-gray-500">
                                                <Bot className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="bg-gray-100 p-3 rounded-lg">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="flex space-x-2">
                            <Textarea
                                placeholder="Type your message here..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 min-h-[44px] max-h-32 resize-none"
                                rows={1}
                            />
                            <Button 
                                onClick={sendMessage} 
                                disabled={!inputText.trim() || isLoading}
                                size="icon"
                                className="h-11 w-11"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}