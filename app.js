import React, { useState, useEffect } from 'react';
import { socket } from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    socket.on('message', msg => setMessages(prev => [...prev, msg]));
    socket.on('typing', setTypingUser);
    socket.on('online-users', setOnlineUsers);
    socket.on('notification', note => {
      setMessages(prev => [...prev, { system: true, text: note }]);
    });
  }, []);

  const handleSend = () => {
    socket.emit('message', { username, text: message });
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing', username);
  };

  const joinChat = () => {
    socket.emit('join', username);
    setJoined(true);
  };

  return (
    <div>
      {!joined ? (
        <div>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div>
          <div>
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.system ? <i>{msg.text}</i> : <b>{msg.username}</b>}: {msg.text}
              </div>
            ))}
            {typingUser && <i>{typingUser} is typing...</i>}
          </div>
          <input value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleTyping} />
          <button onClick={handleSend}>Send</button>
          <div>Online Users: {onlineUsers.join(', ')}</div>
        </div>
      )}
    </div>
  );
}

export default App;
