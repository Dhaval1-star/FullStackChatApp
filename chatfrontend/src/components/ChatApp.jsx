import { useEffect, useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import '../css/chat.css';

function ChatApp() {
  // State for selected user
  const [selectedUser, setSelectedUser] = useState(null);
  const [loginUser, setLoginUser] = useState([]);
  
  useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setLoginUser(storedUser);
    }, []);

  return (
    <div className="container-fluid">
      <div className="row chat-div">
        <div className="col-md-3 p-0 h-100">
          {/* <h4>Selected UserName : {loginUser ? loginUser.name : ""} </h4> */}
          <UserList onSelectUser={setSelectedUser} loginUser={loginUser} />
        </div>
        <div className="col-md-9 h-100">
          <ChatWindow selectedUser={selectedUser}/>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
