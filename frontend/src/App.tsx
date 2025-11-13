import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/PrivateRoute'
import { ToastContainer } from "react-toastify";
import Login from './components/Login';
import Register from './components/Register';
import Confirmation from './components/Confirmation';
import Home from './components/Home'
import Test from './components/Test';


export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/unauthorized" element={<div>404</div>} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                </Routes>
                <ToastContainer aria-label="Notifications" />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;