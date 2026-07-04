import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { Authcontext } from '../context/Authcontext'

const App = () => {
console.log("hello")
  const { authUser, loading } = useContext(Authcontext);   // 👈 hooks at top

  // ⏳ Wait until auth check finishes
  if (loading) {
    console.log("namaste")
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }
console.log("loading:", loading, "authUser:", authUser);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />

      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />

        <Route
          path='/login'
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path='/profile'
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
