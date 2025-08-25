import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const User = () => {
    const { axios } = useAppContext();
    const navigate = useNavigate();
    const { tab = "search" } = useParams(); // <-- use directly, default "search"

    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, limit: 10 });
    const [email, setEmail] = useState("");
    const [searchedUser, setSearchedUser] = useState(null);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    useEffect(() => {
        if (tab === "list") {
            fetchUsers(pagination.page, pagination.limit);
        }
    }, [tab, pagination.page]);

    const fetchUsers = async (page = 1, limit = pagination.limit) => {
        try {
            setLoadingList(true);
            const { data } = await axios.get(`/api/user/all?page=${page}&limit=${limit}`, {
                withCredentials: true,
            });
            if (data.success) {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch (err) {
            toast.error("Error occurred !!!", err);
            setUsers([]);
        } finally {
            setLoadingList(false);
        }
    };

    const updateRole = async (id, role) => {
        try {
            await axios.patch(`/api/user/${id}`, { role });
            if (tab === "list") fetchUsers(pagination.page);
            else setSearchedUser((prev) => ({ ...prev, role }));
            toast.success("Role updated successfully.");
        } catch (err) {
            console.log(err.response.data.message)
            toast.error("Error occurred !!!" + err.response.data.message);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`/api/user/${id}`);
            if (tab === "list") fetchUsers(pagination.page);
            else setSearchedUser(null);
            toast.success("User deleted successfully");
        } catch (err) {
            toast.error("Error occurred !!!", err);
        }
    };

    const handleSearchByEmail = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoadingSearch(true);
        try {
            const res = await axios.get(`/api/user/all?email=${email}`);
            setSearchedUser(res.data.users?.[0] || null);
        } catch (err) {
            toast.error("Error occurred !!!", err);
        } finally {
            setLoadingSearch(false);
        }
    };

    const roleBadge = (role) => {
        const colors = {
            user: "bg-gray-200 text-gray-700",
            moderator: "bg-yellow-100 text-yellow-700",
            admin: "bg-red-100 text-red-700",
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[role]}`}>
                {role}
            </span>
        );
    };

    const handleTabChange = (newTab) => {
        navigate(`/dashboard/users/${newTab}`);
    };

    return (
        <div className="p-6 w-full mx-auto">
            {/* 🔹 Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-2 shadow-inner">
                {["search", "list"].map((tabKey) => (
                    <button
                        key={tabKey}
                        className={`mx-2 px-6 py-2 rounded-lg text-sm font-medium transition ${tab === tabKey
                            ? "bg-blue-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-800"
                            }`}
                        onClick={() => handleTabChange(tabKey)}
                    >
                        {tabKey === "search" ? "🔍 Search & Update" : "👥 User List"}
                    </button>
                ))}
            </div>

            {/* 🔹 User List */}
            {tab === "list" && (
                <div className="mt-6">
                    {loadingList ? (
                        <p className="text-gray-500">Loading users...</p>
                    ) : users?.length ? (
                        <>
                            <div className="overflow-x-auto shadow rounded-lg">
                                <table className="min-w-full border border-gray-200 bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
                                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-3 text-sm font-medium text-gray-900">{u.username}</td>
                                                <td className="px-6 py-3 text-sm text-gray-500">{u.email}</td>
                                                <td className="px-6 py-3 text-sm">{roleBadge(u.role)}</td>
                                                <td className="px-6 py-3 text-sm flex items-center justify-center gap-2">
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => updateRole(u._id, e.target.value)}
                                                        className="px-3 py-1 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="default">Default</option>
                                                        <option value="moderator">Moderator</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button
                                                        onClick={() => deleteUser(u._id)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                                                    >
                                                        🗑 Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* 🔹 Pagination */}
                            <div className="flex justify-center items-center gap-2 mt-6">
                                <button
                                    disabled={pagination.page === 1}
                                    onClick={() =>
                                        setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                                    }
                                    className={`px-3 py-1 rounded-lg border ${pagination.page === 1
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    ⬅ Prev
                                </button>

                                <span className="px-4 py-1 text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>

                                <button
                                    disabled={pagination.page === pagination.totalPages}
                                    onClick={() =>
                                        setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                                    }
                                    className={`px-3 py-1 rounded-lg border ${pagination.page === pagination.totalPages
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "hover:bg-gray-100"
                                        }`}
                                >
                                    Next ➡
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-center">No users found.</p>
                    )}
                </div>
            )}

            {/* 🔹 Search */}
            {tab === "search" && (
                <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow mt-6">
                    <form
                        className="flex items-center bg-gray-50 rounded-full shadow-sm overflow-hidden mb-5"
                        onSubmit={handleSearchByEmail}
                    >
                        <span className="pl-3 text-gray-400 text-base">🔍</span>
                        <input
                            type="email"
                            placeholder="Search user by email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm"
                        />
                        {email && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("");
                                    setSearchedUser(null);
                                }}
                                className="px-3 text-gray-400 hover:text-gray-600"
                            >
                                ✖
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-r-full hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                    </form>

                    {loadingSearch ? (
                        <div className="flex items-center py-7 justify-center">
                            <svg
                                className="animate-spin h-6 w-6 text-blue-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-30"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-80"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                            <span className="text-gray-500">Searching...</span>
                        </div>
                    ) : searchedUser ? (
                        <div className="p-5 border rounded-2xl bg-gray-50 shadow-sm mt-2 flex flex-col items-center">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center text-xl text-blue-600">
                                    {searchedUser.name ? searchedUser.name[0].toUpperCase() : "👤"}
                                </div>
                                <div>
                                    <div className="font-semibold text-base text-gray-900">
                                        {searchedUser.name}
                                    </div>
                                    <div className="text-xs text-gray-500">{searchedUser.email}</div>
                                </div>
                            </div>
                            <div className="mb-4">{roleBadge(searchedUser.role)}</div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <select
                                    value={searchedUser.role}
                                    onChange={(e) =>
                                        setSearchedUser({ ...searchedUser, role: e.target.value })
                                    }
                                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="user">Default</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    onClick={() => updateRole(searchedUser._id, searchedUser.role)}
                                    className="px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                                >
                                    Update Role
                                </button>
                                <button
                                    onClick={() => deleteUser(searchedUser._id)}
                                    className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        email && <div className="mt-2 text-gray-400 text-center">No user found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default User;
