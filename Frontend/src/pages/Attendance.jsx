import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, XCircle } from "lucide-react";

const EMP_API = "https://hrms-lite-backend-0122.onrender.com/api/employees/";
const ATT_API = "https://hrms-lite-backend-0122.onrender.com/api/attendance/";

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

export default function Attendance() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [date]);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(EMP_API);
            setEmployees(response.data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const fetchAttendance = async () => {
        try {
            const response = await axios.get(ATT_API, {
                params: { date },
            });
            // Convert array to object with employeeId as key
            const attendanceMap = {};
            response.data.forEach((att) => {
                attendanceMap[att.employeeId] = att.status;
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    const getStatus = (empId) => {
        return attendance[empId] || null;
    };

    const markAttendance = async (empId, status) => {
        try {
            await axios.post(ATT_API, {
                employeeId: empId,
                date,
                status,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCsrfToken(),
                },
            });
            fetchAttendance();
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const stats = {
        present: Object.values(attendance).filter((s) => s === "present").length,
        absent: Object.values(attendance).filter((s) => s === "absent").length,
        pending: employees.length - Object.keys(attendance).length,
    };

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Attendance</h2>
                    <p className="text-gray-500 text-sm">
                        Track daily employee attendance.
                    </p>
                </div>

                {/* Date Picker */}
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-md px-3 py-2"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-green-600 text-sm">Present</p>
                        <p className="text-2xl font-bold text-green-700">{stats.present}</p>
                    </div>
                    <CheckCircle2 className="text-green-300" size={28} />
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-amber-600 text-sm">Absent</p>
                        <p className="text-2xl font-bold text-amber-700">{stats.absent}</p>
                    </div>
                    <XCircle className="text-amber-300" size={28} />
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p className="text-gray-600 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-gray-700">{stats.pending}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                        <tr>
                            <th className="p-3">Employee</th>
                            <th className="p-3">Department</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((emp) => {
                            const status = getStatus(emp.id);

                            return (
                                <tr key={emp.id} className="border-t">
                                    <td className="p-3 font-medium">{emp.fullName}</td>
                                    <td className="p-3">{emp.department}</td>

                                    <td className="p-3">
                                        {status ? (
                                            <span className="text-sm font-medium capitalize">
                                                {status}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Not marked</span>
                                        )}
                                    </td>

                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => markAttendance(emp.id, "present")}
                                                className={`px-3 py-1 rounded text-xs border ${
                                                    status === "present"
                                                        ? "bg-green-600 text-white border-green-600"
                                                        : "hover:bg-green-50 hover:border-green-300"
                                                }`}
                                            >
                                                Present
                                            </button>

                                            <button
                                                onClick={() => markAttendance(emp.id, "absent")}
                                                className={`px-3 py-1 rounded text-xs border ${
                                                    status === "absent"
                                                        ? "bg-amber-600 text-white border-amber-600"
                                                        : "hover:bg-amber-50 hover:border-amber-300"
                                                }`}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
