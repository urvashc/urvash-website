import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  open: boolean;
  seed?: string;
  onClose: () => void;
}

export default function ChatDrawer({ open, seed = '', onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fill input with seed each time drawer opens
  useEffect(() => {
    if (open) {
      setInput(seed);
      const t = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(t);
    }
  }, [open, seed]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const updated: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        { role: 'assistant', content: 'Connection error — try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.28)',
          zIndex: 999,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Chat with Urvash's AI"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(480px, 100vw)',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--rule)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.10)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--rule)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '10px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-3)',
            }}
          >
            Ask Urvash's AI
          </span>
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ink-3)',
              fontFamily: 'var(--mono)',
              fontSize: '13px',
              lineHeight: 1,
              padding: '12px 14px',
              minWidth: '44px',
              minHeight: '44px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.length === 0 && !loading && (
            <p
              style={{
                fontFamily: 'var(--sans)',
                fontSize: '14px',
                color: 'var(--ink-3)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              What do you want to know?
            </p>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  background: m.role === 'user' ? 'var(--ink)' : 'var(--surface-2)',
                  color: m.role === 'user' ? 'var(--surface)' : 'var(--ink)',
                  padding: '10px 14px',
                  fontFamily: 'var(--sans)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  maxWidth: '85%',
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: '13px',
                color: 'var(--ink-3)',
              }}
            >
              · · ·
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input row */}
        <div
          style={{
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            flexShrink: 0,
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask anything..."
            disabled={loading}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '16px 20px',
              fontFamily: 'var(--sans)',
              fontSize: '14px',
              background: 'transparent',
              color: 'var(--ink)',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            style={{
              border: 'none',
              borderLeft: '1px solid var(--rule)',
              background: 'var(--ink)',
              color: 'var(--surface)',
              fontFamily: 'var(--mono)',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '0 22px',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              opacity: loading || !input.trim() ? 0.35 : 1,
              transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
