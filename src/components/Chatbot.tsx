import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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

  // ── Trigger (replaces .hero-rule) ─────────────────────────────────────────
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-3)',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
        aria-label="Open chat"
      >
        <span
          style={{
            display: 'inline-block',
            width: '28px',
            height: '1px',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
        Ask me anything
      </button>
    );
  }

  // ── Chat panel (fixed bottom-right) ──────────────────────────────────────
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: 'min(460px, calc(100vw - 48px))',
        background: 'var(--surface)',
        border: '1px solid var(--rule)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '13px 16px',
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          onClick={() => setOpen(false)}
          aria-label="Close"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink-3)',
            fontFamily: 'var(--mono)',
            fontSize: '13px',
            lineHeight: 1,
            padding: '2px 4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          overflowY: 'auto',
          padding: '16px',
          minHeight: '120px',
          maxHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
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
                background:
                  m.role === 'user' ? 'var(--ink)' : 'var(--surface-2)',
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
            padding: '14px 16px',
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
            padding: '0 20px',
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
  );
}
