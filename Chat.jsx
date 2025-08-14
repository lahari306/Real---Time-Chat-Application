import React, { useEffect, useRef, useState } from 'react';

function formatTime(ts){
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

export default function Chat({ socket, user, history }) {
  const [messages, setMessages] = useState(history || []);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  // sync prop history -> local messages
  useEffect(() => {
    setMessages(history);
  }, [history]);

  useEffect(() => {
    // scroll to bottom on new message
    if(listRef.current){
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;

    // create a local optimistic message
    const localId = 'local-' + Date.now();
    const msg = {
      id: localId,
      user,
      text: text.trim(),
      ts: Date.now(),
      status: 'sending'
    };

    // optimistic render
    setMessages(prev => [...prev, msg]);
    setText('');

    // emit to server with acknowledgement
    socket.emit('send-message', { id: localId, user: msg.user, text: msg.text, ts: msg.ts }, (ack) => {
      // on ack, we could update message status by replacing id with server id (here server keeps same id)
      setMessages(prev => prev.map(m => m.id === localId ? { ...m, status: 'sent' } : m));
    });

    // If server doesn't ack, we don't hang — user sees message immediately.
  };

  return (
    <div className="chat-container">
      <div className="messages" ref={listRef}>
        {messages.map(m => (
          <div key={m.id} className={'message ' + (m.user === user ? 'mine' : 'other')}>
            <div className="meta">
              <span className="user">{m.user}</span>
              <span className="time">{formatTime(m.ts)}</span>
            </div>
            <div className="text">{m.text}</div>
            <div className="status">{m.status === 'sending' ? 'Sending...' : m.status === 'sent' ? 'Sent' : ''}</div>
          </div>
        ))}
      </div>

      <form className="composer" onSubmit={send}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
