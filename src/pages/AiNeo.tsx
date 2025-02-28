import { useState, useEffect, useRef } from 'react';
import { generateResponse } from '../services/ai';
import { animateScroll } from 'react-scroll';
import { useActiveAccount } from 'thirdweb/react';
import { supabase } from '../utils/supabase';

interface Message {
  text: string;
  isAi: boolean;
}

interface Chat {
  id: number;
  messages: Message[];
}

const AiNeo = () => {
  const activeAccount = useActiveAccount();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Efeito para verificar super usuário
  useEffect(() => {
    const checkSuperUser = async () => {
      setIsCheckingAccess(true);
      if (!activeAccount) {
        setIsSuperUser(false);
        setIsCheckingAccess(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('super_users')
          .select('wallet_address')
          .eq('wallet_address', activeAccount.address)
          .single();

        if (error || !data) {
          console.log('Não é super usuário:', activeAccount.address);
          setIsSuperUser(false);
        } else {
          console.log('É super usuário:', activeAccount.address);
          setIsSuperUser(true);
        }
      } catch (error) {
        console.error('Error checking super user:', error);
        setIsSuperUser(false);
      }
      setIsCheckingAccess(false);
    };

    checkSuperUser();
  }, [activeAccount]);

  // Efeito para carregar chats salvos
  useEffect(() => {
    if (activeAccount) {
      const savedChats = localStorage.getItem(`chats_${activeAccount}`);
      const savedCurrentChatId = localStorage.getItem(`currentChatId_${activeAccount}`);
      
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        setChats(parsedChats);
        
        if (savedCurrentChatId) {
          const chatId = parseInt(savedCurrentChatId);
          setCurrentChatId(chatId);
          const currentChat = parsedChats.find((chat: Chat) => chat.id === chatId);
          if (currentChat) {
            setMessages(currentChat.messages);
          }
        }
      }
    }
  }, [activeAccount]);

  // Efeito para salvar chats
  useEffect(() => {
    if (activeAccount && chats.length > 0) {
      localStorage.setItem(`chats_${activeAccount}`, JSON.stringify(chats));
      if (currentChatId) {
        localStorage.setItem(`currentChatId_${activeAccount}`, currentChatId.toString());
      }
    }
  }, [chats, currentChatId, activeAccount]);

  // Efeito para limpar chats quando desconecta
  useEffect(() => {
    if (!activeAccount) {
      setChats([]);
      setMessages([]);
      setCurrentChatId(null);
    }
  }, [activeAccount]);

  // Efeito para scroll
  useEffect(() => {
    if (messages.length > 0) {
      animateScroll.scrollToBottom({
        containerId: 'chat-messages',
        duration: 500,
        smooth: 'easeInOutQuart'
      });
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!message.trim() || loading) return;

    try {
      setLoading(true);
      
      if (chats.length === 0) {
        const newChatId = Date.now();
        setChats([{ id: newChatId, messages: [] }]);
        setCurrentChatId(newChatId);
      }
      
      const newMessage = { text: message, isAi: false };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      const aiResponse = await generateResponse(message);
      const aiMessage = { text: aiResponse, isAi: true };
      setMessages(prev => [...prev, aiMessage]);

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, newMessage, aiMessage] }
            : chat
        )
      );
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { text: 'Sorry, an error occurred. Please try again.', isAi: true }]);
    } finally {
      setLoading(false);
    }
  };

  const openNewChat = () => {
    const currentChat = chats.find(chat => chat.id === currentChatId);
    if (currentChat && currentChat.messages.length === 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    const newChatId = Date.now();
    setChats([...chats, { id: newChatId, messages: [] }]);
    setCurrentChatId(newChatId);
    setMessages([]);
  };

  const openChat = (chatId: number) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const getChatName = (chat: Chat) => {
    const firstMessage = chat.messages[0]?.text || 'Novo Chat';
    const words = firstMessage.split(' ');
    return words.slice(-3).join(' ') || 'Novo Chat';
  };

  const deleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats(chats.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0]?.id || null);
      setMessages(remainingChats[0]?.messages || []);
    }
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-black py-8 px-3 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
            <h2 className="mt-2 text-base font-medium text-white">
              Verifying access...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!activeAccount || !isSuperUser) {
    return (
      <div className="min-h-screen bg-black py-8 px-3 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ACCESS DENIED
              </h2>
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                <p className="text-lg text-red-400 mb-2">
                In Development
                </p>
                <p className="text-sm text-gray-400">
                  This area is restricted to authorized super users.
                </p>
              </div>
            </div>
            {!activeAccount && (
              <div className="mt-6">
                <p className="text-sm text-gray-400 mb-2">
                  Connect your wallet to verify access
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-6 backdrop-blur-md relative">
            <div className="text-purple-100 text-center">
              <p className="text-lg">
                The current chat is empty. Please add content before creating a new chat.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black flex pt-20">
        <div className="flex flex-col items-start p-4" style={{ width: '200px' }}>
          <div className="chat-controls mb-4">
            <button onClick={openNewChat} className="mb-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 
              text-white px-5 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 
              disabled:hover:from-purple-600 disabled:hover:to-purple-500" style={{ width: '200px' }}>
              New Chat
            </button>
            <ul>
              {chats.map(chat => (
                <li key={chat.id} className="mb-2">
                  <button
                    onClick={() => openChat(chat.id)}
                    className="w-full bg-purple-900/5 border-[0.5px] border-purple-500/20 rounded-lg px-4 py-2 
                      text-sm text-purple-100 backdrop-blur-sm transition-all duration-300
                      hover:bg-purple-900/10 hover:border-purple-500/30 flex justify-between items-center"
                    style={{ width: '200px' }}
                  >
                    <span className="truncate flex-1">{getChatName(chat)}</span>
                    <svg
                      onClick={(e) => deleteChat(chat.id, e)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 text-purple-500/50 hover:text-purple-500 transition-colors ml-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div 
            className={`flex flex-col items-center transition-all duration-500 ${
              messages.length > 0 ? 'mt-4 mb-6' : 'flex-1 justify-center mb-8'
            }`}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Hello, welcome to AI NEO
            </h1>
            <p className="text-purple-300/70 text-base">
              How can I help you today?
            </p>
          </div>

          <div className={`relative mb-8 transition-all duration-500 ${
            messages.length > 0 ? 'flex-1' : 'h-0'
          } w-full max-w-2xl`}>
            <div 
              id="chat-messages"
              className="absolute inset-0 overflow-y-auto no-scrollbar"
            >
              {messages.map((msg, index) => (
                <div 
                  key={`msg-${index}-${msg.text}`}
                  className={`flex ${msg.isAi ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div 
                    className={`max-w-[80%] p-2 rounded-xl backdrop-blur-sm ${
                      msg.isAi 
                        ? 'bg-purple-900/5 text-purple-100 rounded-br-none border-[0.5px] border-purple-500/10' 
                        : 'bg-gray-800/10 text-purple-50 rounded-bl-none border-[0.5px] border-purple-300/5'
                    }`}
                  >
                    <p className="text-sm leading-snug">{msg.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-end">
                  <div className="bg-purple-900/5 text-purple-300 p-2 rounded-xl rounded-br-none border-[0.5px] border-purple-500/10 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="flex gap-3 mb-4 w-[75%] mx-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-purple-900/5 border-[0.5px] border-purple-500/20 rounded-lg px-4 py-2 text-sm text-purple-100 
                placeholder:text-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-[0.5px]
                focus:ring-purple-500/10 backdrop-blur-sm transition-all duration-300"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button 
              className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 
                text-white px-5 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 
                disabled:hover:from-purple-600 disabled:hover:to-purple-500"
              onClick={handleSubmit}
              disabled={loading || !message.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className="text-center mb-4">
            <span className="text-purple-400/60 text-xs">BETA VERSION</span>
          </div>
        </div>

        <div className="flex flex-col items-start p-4" style={{ width: '200px' }}>
          {/* Container vazio para manter a simetria */}
        </div>
      </div>
    </>
  );
};

export default AiNeo;
