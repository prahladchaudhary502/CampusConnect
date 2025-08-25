import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Layout from './pages/dashboard/Layout'
import Dashboard from './pages/dashboard/Dashboard'
import BlogRequest from './pages/dashboard/BlogRequest'
import AddContent from './pages/dashboard/AddContent'
import ListContent from './pages/dashboard/ListContent'
import Comments from './pages/dashboard/Comments'
import Login from './pages/Login'
import 'quill/dist/quill.snow.css'
import { Toaster } from 'react-hot-toast'
import Register from './pages/Register'
import { useAppContext } from '../context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import BlogApprove from './pages/dashboard/BlogApprove'
import ListBlog from './pages/dashboard/ListBlog'
import EditContent from './pages/dashboard/EditContent'
import User from './pages/User'

const App = () => {

  const { user } = useAppContext();

  return (

    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route
            path="request/blog/add"
            element={<ProtectedRoute element={<BlogRequest />} allowedRoles={['default', 'moderator']} user={user} />}
          />
          <Route
            path="request/blog/list"
            element={<ProtectedRoute element={<ListBlog createdByFilter={user?._id} />} allowedRoles={['default', 'moderator']} user={user} />}
          />

          <Route
            path="approve/blog"
            element={<ProtectedRoute element={<BlogApprove />} allowedRoles={['admin']} user={user} />}
          />

          <Route
            path="post/:type"
            element={<ProtectedRoute element={<AddContent />} allowedRoles={['admin']} user={user} />}
          />

          <Route
            path="edit/:type/:id"
            element={<ProtectedRoute element={<EditContent />} allowedRoles={['default', 'moderator', 'admin']} user={user} />}
          />

          <Route
            path="list/:type"
            element={<ProtectedRoute element={<ListContent />} allowedRoles={['admin', 'moderator']} user={user} />}
          />

          <Route
            path="comments/:type"
            element={<ProtectedRoute element={<Comments />} allowedRoles={['default', 'admin', 'moderator']} user={user} />}
          />

          <Route
            path="users/:tab"
            element={<ProtectedRoute element={<User />} allowedRoles={['admin', 'moderator']} user={user} />}
          />
          <Route path="users" element={<Navigate to="/users/search" replace />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App