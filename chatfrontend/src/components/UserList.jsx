import { useEffect, useState } from "react";
import axios from 'axios';

function UserList({ onSelectUser, loginUser }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const getUsers = async (e) => {
    const response = await axios.get("http://localhost:8080/api/auth/users");
    setUsers(response.data);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const onUserSelect = (user) => {
    onSelectUser(user);
    document.querySelectorAll("#userList .user").forEach(el => {
      el.classList.remove("selected");
    });
    var userDiv = document.getElementById('user' + user.id);
    userDiv.classList.add('selected');
  }

  useEffect(() => {
    getUsers();
  }, []);


  return (
    <div className="users-div h-100">
      <h3 className="chat-header px-2">Chats</h3>
      <div className="my-2 px-3">
        <input
          placeholder="Search users..."
          className="form-control search-inp"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      <ul id="userList">
        {filteredUsers.map(u => (
          u.id != loginUser.id ?
            <li
              key={u.id}
              className="user"
              id={"user" + u.id}
              onClick={() => onUserSelect(u)}
              style={{ cursor: "pointer" }}
            >
              {u.name}
            </li> : ""
        ))}
      </ul>

      <div className="login-user">
        UserName : {loginUser.name}
      </div>
    </div>
  );
}

export default UserList;
