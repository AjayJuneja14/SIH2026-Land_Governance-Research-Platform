'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { sendChatQuery } from '@/lib/api';
import { ChatMessage, ChatAction } from '@/types';

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleChat: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  activeLayerToHighlight: string | null;
  setActiveLayerToHighlight: (layerId: string | null) => void;
  handleActionClick: (action: ChatAction) => void;
}

const initialMessage: ChatMessage = {
  id: 'init-1',
  sender: 'assistant',
  text: 'Namaste! I am the **LandGov AI Assistant** for Pune District. I can help analyze cadastral records, simulate land conversion policies, query LULC satellite maps, or summarize regional land governance research.',
  key_points: [
    'Strictly grounded in Pune District land governance and geography',
    'Simulate policy impacts on groundwater, sprawl, and farmland',
    'Cross-reference e-Mahabhumi records and Mula-Mutha flood buffer zones'
  ],
  actions: [
    { label: 'View Sprawl on Map', action_type: 'navigate_gis', payload: { layer: 'sprawl_hotspots', taluka: 'Haveli' } },
    { label: 'Run 10% Policy Simulation', action_type: 'navigate_simulation', payload: { built_up_reduction: 10 } },
    { label: 'Search Cadastral Research', action_type: 'open_research', payload: { query: 'e-Mahabhumi' } }
  ],
  timestamp: 'Just now'
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLayerToHighlight, setActiveLayerToHighlight] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatQuery(text, pathname);
      const assistantMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: response.answer,
        key_points: response.key_points,
        relevant_data: response.relevant_data,
        relevant_research: response.relevant_research,
        relevant_gis_layers: response.relevant_gis_layers,
        sources: response.sources,
        action_buttons: response.action_buttons || response.actions,
        actions: response.action_buttons || response.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'assistant',
        text: 'I encountered an issue connecting to the AI backend. Please verify your connection or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.action_type === 'navigate_gis' || action.action_type === 'activate_layer') {
      if (action.payload?.layer_id || action.payload?.layer) {
        setActiveLayerToHighlight(action.payload.layer_id || action.payload.layer);
      }
      router.push('/gis');
    } else if (action.action_type === 'navigate_simulation' || action.action_type === 'run_simulation') {
      router.push('/policy-simulator');
    } else if (action.action_type === 'open_research' || action.action_type === 'open_doc') {
      router.push('/research');
    } else if (action.action_type === 'navigate' && action.target_url) {
      router.push(action.target_url);
    } else if (action.action_type === 'run_query' && action.payload?.query) {
      sendMessage(action.payload.query);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleChat,
        messages,
        isLoading,
        sendMessage,
        clearChat,
        activeLayerToHighlight,
        setActiveLayerToHighlight,
        handleActionClick
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}