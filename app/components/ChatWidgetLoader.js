'use client';
import dynamic from 'next/dynamic';

// ssr:false must be called from a Client Component in the App Router, so this
// tiny wrapper is what layout.js (a Server Component) actually renders —
// it defers the widget's own bundle until after the page is interactive.
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

export default function ChatWidgetLoader() {
  return <ChatWidget />;
}
