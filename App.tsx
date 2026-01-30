
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeList from './pages/EmployeeList';
import AttendanceTracking from './pages/AttendanceTracking';
import LeaveManagement from './pages/LeaveManagement';
import MyRecords from './pages/MyRecords';
import Reports from './pages/Reports';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ksndmc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ksndmc_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ksndmc_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {user.role === UserRole.ADMIN ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/employees" element={<EmployeeList />} />
              <Route path="/attendance" element={<AttendanceTracking />} />
              <Route path="/leaves" element={<LeaveManagement />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<EmployeeDashboard user={user} />} />
              <Route path="/leaves" element={<LeaveManagement employeeId={user.employeeId} />} />
              <Route path="/records" element={<MyRecords user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
