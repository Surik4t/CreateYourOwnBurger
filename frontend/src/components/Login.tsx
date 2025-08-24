import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const response = await axios.post(
            'http://localhost:8000/users/token',
            new URLSearchParams({
            username: email, // FastAPI OAuth2 ожидает поле 'username'
            password: password
            }),
            {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            }
        );
        await login(response.data.access_token);
        navigate(from, { replace: true });
        } catch (err) {
        setError(
            axios.isAxiosError(err) 
            ? err.response?.data?.detail || 'Invalid email or password'
            : 'Login failed'
        );
        } finally {
        setIsLoading(false);
        }
    };
    
    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <Link to="/register">Sign up</Link>
            </form>
        </div>
    );
};

export default Login;