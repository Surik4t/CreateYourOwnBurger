import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/PrivateRoute'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home'


export const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />}/>
                    <Route path="/unauthorized" element={<div>404</div>} />

                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route element={<Home />}>
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;