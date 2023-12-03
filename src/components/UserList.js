import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaCheck,
  FaFastBackward,
  FaBackward,
  FaForward,
  FaFastForward,
  FaRegCheckSquare,
} from "react-icons/fa";
import { LuDivideCircle, LuTrash2 } from "react-icons/lu";
import { MdCancelPresentation } from "react-icons/md";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editableUser, setEditableUser] = useState(null);
  const [usersPerPage, setUsersPerPage] = useState(10);
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
    setSelectedRows([]);
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
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`page-number px-3 py-1 border border-gray-300 ${
            i === currentPage ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <div className="container mx-auto p-8 bg-white shadow-[0_15px_20px_0px_rgba(0,0,0,0.1)] font-arial text-slate-600">
      <div className="mb-4 flex justify-between">
        <div className="flex items-center">
          <label className="mx-2">Show</label>
          <select
            value={usersPerPage}
            onChange={(e) => setUsersPerPage(e.target.value)}
            className="border py-1 px-4 bg-slate-50 focus:outline-none focus:ring focus:border-blue-100"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
          <label className="m-2">entries</label>
        </div>
        <form className="m-1" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-full border py-1 px-4 bg-slate-50 focus:outline-none focus:ring focus:border-blue-100"
          />
          <button
            type="submit"
            className="search-icon text-xl px-4"
          >
            <FaSearch />
          </button>
        </form>
        <div className="delete-selected">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedRows.length===0}
            className={`text-red-500 border border-red-500 ${selectedRows.length>0 && "hover:text-white hover:bg-red-500 "} rounded p-2`}
          >
            Delete Selected
          </button>
        </div>
      </div>

      <table className="w-full">
        <thead className="w-full">
          <tr className="bg-gray-200 text-left border-y grid grid-cols-12">
            <th className="p-3 pt-3.5 pb-2.5 ">
              <input
                type="checkbox"
                checked={
                  selectedRows.length === currentUsers.length &&
                  selectedRows.length > 0
                }
                onChange={handleToggleSelectAll}
                className="form-checkbox h-4 w-4 text-blue-500"
              />
            </th>
            <th className="p-3 col-span-3">Name</th>
            <th className="p-3 col-span-4">Email</th>
            <th className="p-3 col-span-2">Role</th>
            <th className="p-3 col-span-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr
              key={user.id}
              className={`text-left border-b grid grid-cols-12 hover:bg-gray-100 ${
                selectedRows.includes(user.id) ? "bg-gray-100" : ""
              }`}
            >
              <td className="p-3 pt-3.5 pb-2.5">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => handleToggleSelect(user.id)}
                  className="form-checkbox h-4 w-4 text-blue-500"
                />
              </td>{" "}
              <td
                className={`p-3 col-span-3 ${
                  editableUser === user.id && "p-0"
                }`}
              >
                {editableUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.name}
                    className="w-full h-full p-3 border bg-slate-50 focus:outline-none focus:ring ring-inset focus:border-blue-100"
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
              <td
                className={`p-3 col-span-4 ${
                  editableUser === user.id && "p-0"
                }`}
              >
                {editableUser === user.id ? (
                  <input
                    type="text"
                    value={editedUserData.email}
                    className="w-full h-full p-3 border bg-slate-50 focus:outline-none focus:ring ring-inset focus:border-blue-100"
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
              <td
                className={`p-3 col-span-2 capitalize ${
                  editableUser === user.id && "p-0"
                }`}
              >
                {editableUser === user.id ? (
                  <select
                    type="select"
                    value={editedUserData.role}
                    className="w-full h-full p-3 border bg-slate-50 focus:outline-none focus:ring ring-inset focus:border-blue-100"
                    onChange={(e) =>
                      setEditedUserData({
                        ...editedUserData,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="p-3 col-span-2">
                {editableUser === user.id ? (
                  <>
                    <button
                      className="save mr-2 text-green-500 text-xl"
                      onClick={() => handleSave(user.id, editedUserData)}
                    >
                      <FaRegCheckSquare />
                    </button>
                    <button
                      className="cancel mx-2 text-red-500 text-xl"
                      onClick={handleCancel}
                    >
                      <MdCancelPresentation />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="edit mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete m-2 text-red-500"
                    >
                      <LuTrash2 />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 flex justify-between items-center">
        {currentUsers.length > 0 ? (
          <div className="m-2">
            Showing {indexOfFirstUser + 1} to{" "}
            {currentUsers.length + indexOfFirstUser} of {filteredUsers.length}{" "}
            entries
          </div>
        ) : (
          <div className="m-2">No Users</div>
        )}
        <div className="m-2 text-gray-400">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`first-page px-3 py-1 border border-gray-300  ${
              currentPage === 1 && "bg-gray-200"
            }`}
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`previous-page px-3 py-1 border border-gray-300 ${
              currentPage === 1 && "bg-gray-200"
            }`}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`next-page px-3 py-1 border border-gray-300 ${
              currentPage === totalPages && "bg-gray-200"
            }`}
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`last-page px-3 py-1 border border-gray-300 ${
              currentPage === totalPages && "bg-gray-200"
            }`}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
