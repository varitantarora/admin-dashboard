import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

const UserList = () => {
  const usersPerPage = 10;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editableUser, setEditableUser] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (id) => {
    setEditableUser(id);
    const currentUser = users.find((user) => user.id === id);
    setEditedUserData({
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    });
  };

  const handleSave = (id, updatedUserData) => {
    console.log(updatedUserData);
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...updatedUserData } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditableUser(null);
    setEditedUserData({ name: "", email: "", role: "" });
  };

  const handleCancel = () => {
    setEditableUser(null);
    setEditedUserData({ name: "", email: "", role: "" });
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  const handleToggleSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    const newSelectedRows = isSelected
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
  };

  const handleToggleSelectAll = () => {
    const allSelected = selectedRows.length === currentUsers.length;
    const newSelectedRows = allSelected
      ? []
      : [...currentUsers.map((user) => user.id)];
    setSelectedRows(newSelectedRows);
  };

  const handleDeleteSelected = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };
  const renderPageNumbers = () => {
    const pagesToShow = 1;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === currentPage ||
        (i >= currentPage - pagesToShow && i <= currentPage + pagesToShow) ||
        i === totalPages
      ) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`page-number mx-1 px-3 py-1 border ${
              i === currentPage ? "bg-blue-500 text-white" : ""
            }`}
          >
            {i}
          </button>
        );
      }
    }
    return pageNumbers;
  };
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 mr-2"
          />
          <button type="submit" className="search-icon bg-blue-500 text-white p-2">
            <FaSearch />
          </button>
        </form>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">
              <input
                type="checkbox"
                checked={selectedRows.length === currentUsers.length}
                onChange={handleToggleSelectAll}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
            </th>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              className={selectedRows.includes(user.id) ? "bg-gray-100" : ""}
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleToggleSelect(user.id)}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
              </td>{" "}
              <td className="p-2">{user.id}</td>
              <td className="p-2 ">
                {editableUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.name}
                    className="w-32"
                    onChange={(e) =>
                      setEditedUserData({
                        ...editedUserData,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-2">
                {editableUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.email}
                    className="w-32"
                    onChange={(e) =>
                      setEditedUserData({
                        ...editedUserData,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-2">
                {editableUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.role}
                    className="w-32"
                    onChange={(e) =>
                      setEditedUserData({
                        ...editedUserData,
                        role: e.target.value,
                      })
                    }
                  />
                ) : (
                  user.role
                )}
              </td>
              <td className="p-2">
                {editableUser === user.id ? (
                  <>
                    <button
                      className="save mr-2"
                      onClick={() => handleSave(user.id, editedUserData)}
                    >
                      <FaCheck />
                    </button>
                    <button className="cancel mr-2" onClick={handleCancel}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="edit text-blue-500 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="first-page text-blue-500"
          >
            First Page
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="previous-page text-blue-500 mx-2"
          >
            Previous Page
          </button>
        </div>
        <div>{renderPageNumbers()}</div>
        <div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="next-page text-blue-500 mx-2"
          >
            Next Page
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="last-page text-blue-500"
          >
            Last Page
          </button>
        </div>
      </div>
      <div className="mt-4 delete-selected">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white p-2"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default UserList;
