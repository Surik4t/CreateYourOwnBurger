import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AvatarProvider } from './contexts/AvatarContext.tsx'
import { ProtectedRoute } from './components/PrivateRoute'
import { Flip, ToastContainer } from "react-toastify";
import Login from './components/Login';
import Register from './components/Register';
import Confirmation from './components/Confirmation';
import Home from './components/Home'
import Profile from './components/Profile';

export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AvatarProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/confirmation" element={<Confirmation />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Routes>
                </AvatarProvider>
                <ToastContainer 
                    aria-label="Notifications"
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Flip}
                />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;