import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { BlogDetail } from './pages/BlogDetail';
import { Search } from './pages/Search';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { Dashboard } from './pages/Dashboard';
import { PostManage } from './pages/PostManage';
import { DashboardPosts } from './pages/DashboardPosts';
import { DashboardUsers } from './pages/DashboardUsers';
import { DashboardCategories } from './pages/DashboardCategories';
import { DashboardSettings } from './pages/DashboardSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<BlogDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Route>

          {/* Dashboard Routes via dynamic role prefix */}
          <Route path="/:role/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<DashboardPosts />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
          
          {/* Create post */}
          <Route path="/post/create" element={<DashboardLayout />}>
             <Route index element={<PostManage />} />
          </Route>
          
          {/* Edit post */}
          <Route path="/post/edit/:id" element={<DashboardLayout />}>
             <Route index element={<PostManage editMode />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
