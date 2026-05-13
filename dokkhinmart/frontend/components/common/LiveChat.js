import React, { useState } from 'react';
import { faqs } from '../data/products-data';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'হাই! 👋 দোক্ষিণের স্বাদে স্বাগতম। আমরা কীভাবে সাহায্য করতে পারি?',
      time: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue,
      time: new Date()
    };
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'আমাদের FAQ দেখুন বা কোনো প্রশ্ন জিজ্ঞাসা করুন! আমরা সর্বদা সাহায্য করতে প্রস্তুত।',
        time: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleQuickReply = (text) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      time: new Date()
    };
    setMessages([...messages, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'আমাদের দলের সাথে কথা বলতে হলে সরাসরি ফোন করুন বা WhatsApp করুন। আমরা ২৪/৭ উপলব্ধ!',
        time: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const quickReplies = [
    'ডেলিভারি সম্পর্কে',
    'মাছ সম্পর্কে',
    'মধু সম্পর্কে',
    'অর্ডার করতে চাই'
  ];

  return (
    <>
      {/* Chat Widget */}
      {isOpen ? (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '380px',
          maxHeight: '600px',
          background: 'white',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--green-mid) 0%, var(--green-dark) 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: 'var(--radius) var(--radius) 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '16px' }}>💬 DokkhinMart Support</h4>
              <small style={{ opacity: 0.8 }}>Usually replies instantly</small>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: 'var(--cream)'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                gap: '8px'
              }}>
                {msg.type === 'bot' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--green-mid)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    🐠
                  </div>
                )}
                <div style={{
                  maxWidth: '280px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: msg.type === 'user' ? 'var(--green-mid)' : 'white',
                  color: msg.type === 'user' ? 'white' : 'var(--text-dark)',
                  fontSize: '14px',
                  wordWrap: 'break-word',
                  border: msg.type === 'bot' ? '1px solid var(--border)' : 'none'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          {messages.length <= 3 && (
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              background: 'white',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'var(--green-pale)',
                    border: '1px solid var(--border)',
                    color: 'var(--green-mid)',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'var(--green-mid)';
                    e.target.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'var(--green-pale)';
                    e.target.style.color = 'var(--green-mid)';
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              display: 'flex',
              gap: '8px',
              padding: '12px 16px',
              borderTop: '1px solid var(--border)',
              background: 'white'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                fontSize: '13px',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--green-mid)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'var(--green-dark)'}
              onMouseOut={(e) => e.target.style.background = 'var(--green-mid)'}
            >
              📤
            </button>
          </form>
        </div>
      ) : null}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--green-mid) 0%, var(--green-dark) 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(45,106,79,0.4)',
          transition: 'all 0.3s ease',
          zIndex: 9999
        }}
        title="Chat with us!"
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 8px 24px rgba(45,106,79,0.6)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 16px rgba(45,106,79,0.4)';
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Floating Badge */}
      {!isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: 'var(--danger)',
          color: 'white',
          padding: '8px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 9998,
          animation: 'pulse 2s infinite'
        }}>
          1 new message
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
