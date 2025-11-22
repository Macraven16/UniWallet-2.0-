"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Mail, FileText, Plus, Trash2, Edit, Download, Printer, X, CheckSquare, Square } from "lucide-react";

export default function StudentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkAdd, setShowBulkAdd] = useState(false);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [universities, setUniversities] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<any>(null);

    // Add Student Form State
    const [newStudent, setNewStudent] = useState({
        name: "",
        email: "",
        password: "password123", // Default password
        studentIdNumber: "",
        grade: "",
        schoolId: "",
        campus: "",
        phoneNumber: ""
    });

    useEffect(() => {
        fetchStudents();
        fetchUniversities();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/students");
            if (res.ok) {
                const data = await res.json();
                // Transform data to flat structure for table
                const formatted = data.map((s: any) => ({
                    id: s.id,
                    userId: s.userId,
                    name: s.user?.name,
                    email: s.user?.email,
                    studentIdNumber: s.studentIdNumber,
                    grade: s.grade,
                    balance: s.wallet?.balance || 0,
                    schoolName: s.school?.name,
                    schoolId: s.schoolId,
                    campus: s.campus,
                    phoneNumber: s.user?.phoneNumber || ""
                }));
                setStudents(formatted);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUniversities = async () => {
        try {
            const res = await fetch("/api/universities");
            if (res.ok) {
                const data = await res.json();
                setUniversities(data);
            }
        } catch (error) {
            console.error("Failed to fetch universities", error);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentIdNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStudent),
            });

            if (res.ok) {
                alert("Student Added Successfully!");
                setShowAddModal(false);
                fetchStudents();
                setNewStudent({ name: "", email: "", password: "password123", studentIdNumber: "", grade: "", schoolId: "", campus: "", phoneNumber: "" });
            } else {
                const error = await res.json();
                alert("Failed to add student: " + error.error);
            }
        } catch (error) {
            console.error("Error adding student", error);
            alert("Error adding student");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (student: any) => {
        setEditingStudent({
            id: student.id,
            name: student.name,
            email: student.email,
            studentIdNumber: student.studentIdNumber,
            grade: student.grade,
            schoolId: student.schoolId,
            campus: student.campus || "",
            phoneNumber: student.phoneNumber || ""
        });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/students/${editingStudent.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingStudent),
            });

            if (res.ok) {
                alert("Student Updated Successfully!");
                setShowEditModal(false);
                fetchStudents();
                setEditingStudent(null);
            } else {
                const error = await res.json();
                alert("Failed to update student: " + error.error);
            }
        } catch (error) {
            console.error("Error updating student", error);
            alert("Error updating student");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
            try {
                const res = await fetch(`/api/students/${id}`, {
                    method: "DELETE",
                });
                if (res.ok) {
                    setStudents(students.filter(s => s.id !== id));
                } else {
                    alert("Failed to delete student");
                }
            } catch (error) {
                console.error("Error deleting student", error);
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedStudents.length === filteredStudents.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(filteredStudents.map(s => s.id));
        }
    };

    const toggleSelectStudent = (id: string) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(s => s !== id));
        } else {
            setSelectedStudents([...selectedStudents, id]);
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add New Student</h3>
                            <button onClick={() => setShowAddModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={newStudent.name}
                                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={newStudent.email}
                                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    value={newStudent.phoneNumber}
                                    onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="024XXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Student ID</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newStudent.studentIdNumber}
                                        onChange={(e) => setNewStudent({ ...newStudent, studentIdNumber: e.target.value })}
                                        className="w-full p-2 border rounded-md"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const year = new Date().getFullYear();
                                            const random = Math.floor(1000 + Math.random() * 9000);
                                            setNewStudent({ ...newStudent, studentIdNumber: `GCTU-${year}-${random}` });
                                        }}
                                        className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm whitespace-nowrap hover:bg-secondary/80"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">University</label>
                                <select
                                    value={newStudent.schoolId}
                                    onChange={(e) => setNewStudent({ ...newStudent, schoolId: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select University</option>
                                    {universities.map(uni => (
                                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Grade/Level</label>
                                <input
                                    type="text"
                                    value={newStudent.grade}
                                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="e.g. Level 100"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Campus</label>
                                <input
                                    type="text"
                                    value={newStudent.campus}
                                    onChange={(e) => setNewStudent({ ...newStudent, campus: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Main Campus"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-md disabled:opacity-50"
                            >
                                {isSubmitting ? "Adding..." : "Add Student"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Student Modal */}
            {showEditModal && editingStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Edit Student</h3>
                            <button onClick={() => setShowEditModal(false)}><X className="h-5 w-5" /></button>
                        </div>
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    value={editingStudent.name}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={editingStudent.email}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editingStudent.phoneNumber}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, phoneNumber: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="024XXXXXXX"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Student ID</label>
                                <input
                                    type="text"
                                    value={editingStudent.studentIdNumber}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, studentIdNumber: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">University</label>
                                <select
                                    value={editingStudent.schoolId}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, schoolId: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                >
                                    <option value="">Select University</option>
                                    {universities.map(uni => (
                                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Grade/Level</label>
                                <input
                                    type="text"
                                    value={editingStudent.grade}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, grade: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="e.g. Level 100"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Campus</label>
                                <input
                                    type="text"
                                    value={editingStudent.campus}
                                    onChange={(e) => setEditingStudent({ ...editingStudent, campus: e.target.value })}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Main Campus"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-md disabled:opacity-50"
                            >
                                {isSubmitting ? "Update Student" : "Update Student"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Students</h1>
                    <p className="text-muted-foreground">Manage student enrollment and financial status.</p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                        <Filter className="mr-2 h-4 w-4" />
                        Filter
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Student
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between py-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search students..."
                        className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border rounded-md hover:bg-muted" title="Print List">
                        <Printer className="h-4 w-4" />
                    </button>
                    <button className="p-2 border rounded-md hover:bg-muted" title="Export CSV">
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                                    <button onClick={toggleSelectAll}>
                                        {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ?
                                            <CheckSquare className="h-4 w-4" /> :
                                            <Square className="h-4 w-4" />
                                        }
                                    </button>
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Student ID</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Grade</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Outstanding Balance</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">Loading students...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center">No students found.</td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            <button onClick={() => toggleSelectStudent(student.id)}>
                                                {selectedStudents.includes(student.id) ?
                                                    <CheckSquare className="h-4 w-4 text-primary" /> :
                                                    <Square className="h-4 w-4 text-muted-foreground" />
                                                }
                                            </button>
                                        </td>
                                        <td className="p-4 align-middle font-medium">{student.studentIdNumber}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{student.name}</span>
                                                <span className="text-xs text-muted-foreground">{student.email}</span>
                                                <span className="text-[10px] text-muted-foreground">{student.schoolName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">{student.grade}</td>
                                        <td className="p-4 align-middle">
                                            <span className={student.balance > 0 ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                                                GHS {student.balance.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                                Active
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEditClick(student)}
                                                    className="p-2 hover:bg-accent rounded-md"
                                                    title="Edit Student"
                                                >
                                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 hover:bg-destructive/10 rounded-md"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
