import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const socket = io(SOCKET_URL);

export default function App() {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState('');
  const [tempUser, setTempUser] = useState('');

  useEffect(() => {
    socket.on('history', (msgs) => {
      setHistory(msgs);
    });
    socket.on('new-message', (msg) => {
      setHistory(prev => [...prev, msg]);
    });

    return () => {
      socket.off('history');
      socket.off('new-message');
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (tempUser.trim()) {
      setUser(tempUser.trim());
    }
  };

  // 👇 Only show username form until user is set
  if (!user) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh"}}>
        <h2>Enter your username</h2>
        <form onSubmit={handleUsernameSubmit} style={{display:"flex",gap:"10px"}}>
          <input
            type="text"
            value={tempUser}
            onChange={(e) => setTempUser(e.target.value)}
            placeholder="Your name"
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Realtime Chat</h1>
        <div className="me">You: <strong>{user}</strong></div>
      </header>
      <Chat socket={socket} user={user} history={history} />
    </div>
  );
}
