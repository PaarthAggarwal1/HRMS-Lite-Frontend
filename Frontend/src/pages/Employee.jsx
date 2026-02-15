import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Pen } from "lucide-react";
import axios from "axios";

const API = "/api/employees/";

function getCsrfToken() {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default function Employees() {
    const [employees, setEmployees] = useState([]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        department: "",
        role: "",
    });

    const filteredEmployees = employees.filter((emp) =>
        emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(API);
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleEdit = (emp) => {
        setFormData(emp);
        setEditingId(emp.id);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(API, {
                    fullName: formData.fullName,
                    email: formData.email,
                    department: formData.department,
                    role: formData.role,
                    id: editingId,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                });
            } else {
                await axios.post(API, formData, {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCsrfToken(),
                    },
                });
            }
            setFormData({ fullName: "", email: "", department: "", role: "" });
            setEditingId(null);
            setShowModal(false);
            fetchEmployees();
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(API, {
                data: { id },
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
            });
            fetchEmployees();
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Employees</h2>
                    <p className="text-gray-500 text-sm">
                        Manage your team members.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setShowModal(true);
                        setEditingId(null);
                        setFormData({ fullName: "", email: "", department: "", role: "" });
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Employee
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Department</th>
                            <th className="p-3">Role</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center p-6 text-gray-500">
                                    No employees found
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="border-t">
                                    <td className="p-3">
                                        <div>
                                            <p className="font-medium">{emp.fullName}</p>
                                            <p className="text-xs text-gray-500">{emp.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-3">{emp.department}</td>
                                    <td className="p-3">{emp.role}</td>
                                    <td className="p-3 text-right space-x-4">
                                        <button
                                            onClick={() => handleEdit(emp)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Pen size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    {/* Modal Container */}
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-lg
                    max-h-[90vh] overflow-y-auto">

                        {/* Header */}
                        <div className="p-5 border-b">
                            <h3 className="text-lg font-semibold">
                                {editingId ? "Edit Employee" : "Add Employee"}
                            </h3>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">

                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.fullName}
                                onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                }
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Department"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({ ...formData, department: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Role"
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({ ...formData, role: e.target.value })
                                }
                            />

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingId(null);
                                        setFormData({ fullName: "", email: "", department: "", role: "" });
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 border rounded-md"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingId ? "Update Employee" : "Add Employee"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
