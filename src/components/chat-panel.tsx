'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Bot } from 'lucide-react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Logo } from './icons';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isGenerating: boolean;
}

export function ChatPanel({
  messages,
  onSendMessage,
  isGenerating,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-card shadow-lg">
      <div className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full flex items-center justify-center bg-primary rounded-full">
                      <Logo className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-lg px-4 py-3 max-w-[80%] text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {typeof message.content === 'string' ? <p className="whitespace-pre-wrap">{message.content}</p> : message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-3 justify-start">
                 <Avatar className="w-8 h-8">
                    <div className="w-full h-full flex items-center justify-center bg-primary rounded-full">
                      <Logo className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </Avatar>
                <div className="rounded-lg px-4 py-3 max-w-[80%] text-sm bg-muted text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isGenerating}
          />
          <Button type="submit" size="icon" disabled={isGenerating || !input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
