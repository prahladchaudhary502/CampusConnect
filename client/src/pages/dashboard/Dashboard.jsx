import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import BlogTableItem from '../../components/dashboard/BlogTableItem';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const [showChangePwd, setShowChangePwd] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const { axios, user } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/user/dashboard');
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch dashboard');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]); // run again once user is available

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');

    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError('All fields are required');
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError('New passwords do not match');
      return;
    }
    setPwdLoading(true);
    try {
      const { data } = await axios.post('/api/user/change-password', {
        currentPassword: currentPwd,
        newPassword: newPwd,
      });
      if (data.success) {
        toast.success('Password changed successfully');
        setShowChangePwd(false);
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        setPwdError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setPwdError(error.response?.data?.message || error.message || 'Error occurred');
    }
    setPwdLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gray-50 min-h-screen font-sans text-gray-800">

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[300px] flex flex-col items-center border border-gray-100 h-fit">
        <div className="relative w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-extrabold mb-6 shadow-md">
          {user?.username?.trim()?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide">{user?.username || 'User Name'}</h2>
        <p className="text-gray-500 mb-6 text-sm">{user?.email || 'user@example.com'}</p>
        <button
          onClick={() => setShowChangePwd(!showChangePwd)}
          className={`py-2 px-6 text-white rounded-lg transition duration-300 ease-in-out font-medium shadow-md
            ${showChangePwd
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {showChangePwd ? 'Cancel' : 'Change Password'}
        </button>

        {showChangePwd && (
          <form onSubmit={handleChangePassword} className="mt-6 w-full animate-fade-in">
            {pwdError && (
              <p className="text-red-500 text-sm mb-3 text-center bg-red-50 p-2 rounded-lg border border-red-200">
                {pwdError}
              </p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="currentPwd">
                Current Password
              </label>
              <input
                id="currentPwd"
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="newPwd">
                New Password
              </label>
              <input
                id="newPwd"
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="confirmPwd">
                Confirm New Password
              </label>
              <input
                id="confirmPwd"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={pwdLoading}
              className="py-3 px-6 w-full bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md"
            >
              {pwdLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Stats and Recent Blogs */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="p-3 bg-blue-100 rounded-full">
              <img src={assets.dashboard_icon_1} alt="Blogs" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800">{dashboardData.blogs}</p>
              <p className="text-gray-500 font-light text-sm">Blogs</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="p-3 bg-green-100 rounded-full">
              <img src={assets.dashboard_icon_2} alt="Comments" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800">{dashboardData.comments}</p>
              <p className="text-gray-500 font-light text-sm">Comments</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <div className="p-3 bg-purple-100 rounded-full">
              <img src={assets.dashboard_icon_3} alt="Drafts" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800">{dashboardData.drafts}</p>
              <p className="text-gray-500 font-light text-sm">Drafts</p>
            </div>
          </div>
        </div>

        {/* Latest Blogs Table */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-gray-600">
            <img src={assets.dashboard_icon_4} alt="Latest Blogs" className="w-6 h-6" />
            <h3 className="text-xl font-semibold text-gray-700">Latest Blogs</h3>
          </div>
          <div className="relative max-w-full overflow-x-auto">
            <table className="w-full text-sm text-gray-500 text-left">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">#</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Blog Title</th>
                  <th scope="col" className="px-4 py-3 font-semibold max-sm:hidden">Date</th>
                  <th scope="col" className="px-4 py-3 font-semibold max-sm:hidden">Status</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
