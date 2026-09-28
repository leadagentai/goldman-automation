'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GREETING =
  "Hi, I'm Adrian's AI assistant. Tell me what kind of business you run and what's eating your time, and I'll tell you honestly whether automation could help. I can also book your free 20-minute audit.";

const TEASER_TEXT = 'Not sure where AI fits in your business? Ask me.';
const TEASER_DELAY_MS = 25000;
const TEASER_SCROLL_FRACTION = 0.5;
const MOBILE_QUERY = '(max-width: 640px)';

const CHIPS = [
  'Missed calls & enquiries',
  'No-shows',
  'Chasing & follow-ups',
  'Paperwork',
  'Not sure where to start',
];

const STORAGE_MESSAGES = 'ga_chat_messages';
const STORAGE_CONVERSATION = 'ga_chat_conversation_id';
const STORAGE_TEASER_SEEN = 'ga_chat_teaser_seen';

function loadSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (private mode, etc) — chat still works, just isn't remembered
  }
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const fabRef = useRef(null);
  const teaserSeenRef = useRef(false);
  const contactInViewRef = useRef(false);
  const pendingTeaserRef = useRef(false);
  const wasOpenRef = useRef(false);

  // --- persistence (session-scoped conversation) ---
  useEffect(() => {
    const savedMessages = loadSession(STORAGE_MESSAGES);
    const savedConversationId = loadSession(STORAGE_CONVERSATION);
    if (savedMessages && savedMessages.length) setMessages(savedMessages);
    if (savedConversationId) setConversationId(savedConversationId);
    teaserSeenRef.current = Boolean(loadSession(STORAGE_TEASER_SEEN));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSession(STORAGE_MESSAGES, messages);
  }, [messages, hydrated]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  // --- mobile breakpoint tracking (drives full-screen sheet + aria-modal) ---
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // --- focus management: move in on open, back to the fab on an actual close
  // (not on first mount, when the fab hasn't been interacted with yet) ---
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else if (wasOpenRef.current) {
      fabRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  // --- close on Escape ---
  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  function markTeaserSeen() {
    teaserSeenRef.current = true;
    saveSession(STORAGE_TEASER_SEEN, true);
    setShowTeaser(false);
  }

  // --- teaser bubble: once per session, after 10s or 25% scroll, never over #contact ---
  useEffect(() => {
    if (!hydrated || teaserSeenRef.current || open) return undefined;

    function tryShowTeaser() {
      if (teaserSeenRef.current || open) return;
      if (contactInViewRef.current) {
        pendingTeaserRef.current = true;
        return;
      }
      setShowTeaser(true);
    }

    const timer = setTimeout(tryShowTeaser, TEASER_DELAY_MS);

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= TEASER_SCROLL_FRACTION) {
        tryShowTeaser();
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    let observer;
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      observer = new IntersectionObserver(
        ([entry]) => {
          contactInViewRef.current = entry.isIntersecting;
          if (!entry.isIntersecting && pendingTeaserRef.current) {
            pendingTeaserRef.current = false;
            tryShowTeaser();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(contactEl);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      if (observer) observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, open, pathname]);

  function openChat() {
    markTeaserSeen();
    setOpen(true);
  }

  function closeChat() {
    setOpen(false);
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages,
          conversationId,
          pageUrl: typeof window !== 'undefined' ? window.location.href : null,
        }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistantText = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const metaIndex = buffer.indexOf('\u0000META\u0000');
        const visible = metaIndex === -1 ? buffer : buffer.slice(0, metaIndex);
        assistantText = visible;
        buffer = metaIndex === -1 ? '' : buffer;

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: assistantText };
          return copy;
        });

        if (metaIndex !== -1) {
          const metaRaw = buffer.slice(metaIndex + 6);
          try {
            const meta = JSON.parse(metaRaw);
            if (meta.conversationId) {
              setConversationId(meta.conversationId);
              saveSession(STORAGE_CONVERSATION, meta.conversationId);
            }
          } catch {
            // ignore malformed trailing metadata
          }
          break;
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Something went wrong on my end. Email hello@goldmanautomation.co.uk and Adrian will pick it up.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  const showChips = messages.length === 1;

  if (!open) {
    return (
      <>
        {showTeaser && (
          <div className="chat-teaser" role="status">
            <button
              type="button"
              className="chat-teaser-dismiss"
              onClick={markTeaserSeen}
              aria-label="Dismiss"
            >
              ×
            </button>
            <button type="button" className="chat-teaser-text" onClick={openChat}>
              {TEASER_TEXT}
            </button>
          </div>
        )}
        <button
          ref={fabRef}
          type="button"
          className="chat-fab"
          onClick={openChat}
          aria-label="Ask about your business"
        >
          Ask about your business
        </button>
      </>
    );
  }

  return (
    <div
      className="chat-panel"
      role="dialog"
      aria-modal={isMobile ? 'true' : undefined}
      aria-label="Chat with Adrian's AI assistant"
    >
      <div className="chat-header">
        <div>
          <strong>Ask about your business</strong>
          <p className="chat-subhead">
            AI assistant. This is one of the systems Adrian builds. Chats are stored so Adrian
            can follow up. <Link href="/privacy">Privacy policy</Link>.
          </p>
        </div>
        <button type="button" className="chat-close" onClick={closeChat} aria-label="Close chat">
          ×
        </button>
      </div>

      <div className="chat-body" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg-${m.role}`}>
            {m.content}
          </div>
        ))}
        {sending && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="chat-msg chat-msg-assistant chat-msg-typing">…</div>
        )}

        {showChips && (
          <div className="chat-chips">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chat-chip"
                onClick={() => sendMessage(chip)}
                disabled={sending}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          aria-label="Message"
          maxLength={1500}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
