import { useEffect, useRef, useState } from "react";
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

var clientConn = null;
function ChatWindow({ selectedUser }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const selectedUserRef = useRef(selectedUser);


  const getChats = async (sender, recipient) => {
    const response = await axios.get(`http://localhost:8080/get/chat/${sender}/${recipient}`);
    setChats(response.data);
  };

  const connect = (message) => {
    if(!clientConn || (clientConn && !clientConn.connect)) {
      const client = new SockJS('http://localhost:8080/chat');
      clientConn = over(client);
      clientConn.connect({}, () => {
        onConnected();
        if(message) {
          clientConn.send('/app/privateMessage', {}, message);
        }
      }, onError);
    }
  }

  const onError = (err) => {
    console.log(err);
  }

  const onConnected = () => {
    if(clientConn.connected) {
      clientConn.subscribe('/user/' + user.name + '/private', onPrivateMessage);      
    }
  };

  const onPrivateMessage = (payload)=> {
    var data = JSON.parse(payload.body);
    if(selectedUserRef.current && data.recipient == user.name && data.sender == selectedUserRef.current.name) {
      setChats(prevChats => [...prevChats, data]);
    }
  }

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    const chat = {
      sender : user.name,
      recipient : selectedUserRef.current.name,
      content : message
    }
    setChats(prevChats => [...prevChats, chat]);
    setMessage("");
    if (!clientConn || !clientConn.connected) {
      connect(JSON.stringify(chat));
    } else {
      clientConn.send('/app/privateMessage', {}, JSON.stringify(chat));
    }
  };

  useEffect(() => {
    selectedUserRef.current = selectedUser;
    if(selectedUser && user) {
      getChats(user.name, selectedUser.name)
    }
    connect(null);
  }, [selectedUser])

  if (!selectedUser) {
    return <div className="d-flex h-100 align-items-center justify-content-center text-muted">Select a user to start chatting</div>;
  }

  return (
    <div className="d-flex flex-column chat-div">
      <div className="mb-2 chat-name">{selectedUser.name}</div>
      <div className="flex-grow-1 chat-messages mb-3">
        {chats.map((chat, idx) => (
          chat.recipient == selectedUser.name ? 
            <div key={idx} className={"text-end"}>
              <span className={`badge ${"bg-primary"}`}>
                {chat.content}
              </span>
            </div>
          :
          <div key={idx} className={"text-start"}>
            <span className={`badge ${"bg-secondary"}`}>
              {chat.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="d-flex gap-2">
        <input
          className="form-control"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="btn send-btn" type="submit">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="var(--white)" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;
