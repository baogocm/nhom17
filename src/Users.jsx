import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";

const API_URL = "https://67da405935c87309f52ba22e.mockapi.io/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ fullName: "", studentId: "", className: "" });
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({ fullName: "", studentId: "", className: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(API_URL)
      .then(response => setUsers(response.data))
      .catch(error => console.error("Lỗi khi lấy danh sách users:", error));
  };

  // Kiểm tra dữ liệu đầu vào
  const validateUser = (user) => {
    if (!user.fullName.trim() || !user.studentId.trim() || !user.className.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return false;
    }
    if (user.studentId.length < 10) {
      setError("Mã sinh viên phải có ít nhất 10 ký tự.");
      return false;
    }
    setError("");
    return true;
  };

  // Thêm user mới
  const addUser = () => {
    if (!validateUser(newUser)) return;
    axios.post(API_URL, newUser)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUser({ fullName: "", studentId: "", className: "" });
      })
      .catch(error => console.error("Lỗi khi thêm user:", error));
  };

  // Xóa user (có xác nhận)
  const deleteUser = (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;
    axios.delete(`${API_URL}/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error("Lỗi khi xóa user:", error));
  };

  // Bắt đầu chỉnh sửa user
  const startEditUser = (user) => {
    setEditUserId(user.id);
    setEditUserData({ fullName: user.fullName, studentId: user.studentId, className: user.className });
  };

  // Cập nhật user
  const updateUser = (id) => {
    if (!validateUser(editUserData)) return;
    axios.put(`${API_URL}/${id}`, editUserData)
      .then(response => {
        setUsers(users.map(user => (user.id === id ? response.data : user)));
        setEditUserId(null);
      })
      .catch(error => console.error("Lỗi khi cập nhật user:", error));
  };

  return (
    <div className="users-container">
      <h2>Quản lý Users</h2>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error">{error}</p>}

      {/* Form thêm user */}
      <div className="add-user">
        <h3>Thêm User mới</h3>
        <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
        <input type="text" placeholder="Student ID" value={newUser.studentId} onChange={(e) => setNewUser({ ...newUser, studentId: e.target.value })} />
        <input type="text" placeholder="Class Name" value={newUser.className} onChange={(e) => setNewUser({ ...newUser, className: e.target.value })} />
        <button onClick={addUser}>Thêm User</button>
      </div>

      {/* Bảng hiển thị danh sách user */}
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Student ID</th>
            <th>Class Name</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editUserId === user.id ? (
                  <input type="text" value={editUserData.fullName} onChange={(e) => setEditUserData({ ...editUserData, fullName: e.target.value })} />
                ) : (
                  user.fullName
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input type="text" value={editUserData.studentId} onChange={(e) => setEditUserData({ ...editUserData, studentId: e.target.value })} />
                ) : (
                  user.studentId
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <input type="text" value={editUserData.className} onChange={(e) => setEditUserData({ ...editUserData, className: e.target.value })} />
                ) : (
                  user.className
                )}
              </td>
              <td>
                {editUserId === user.id ? (
                  <>
                    <button onClick={() => updateUser(user.id)}>Lưu</button>
                    <button onClick={() => setEditUserId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditUser(user)}>Sửa</button>
                    <button className="delete" onClick={() => deleteUser(user.id)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
