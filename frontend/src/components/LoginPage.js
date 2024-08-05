import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Member');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("Sending email:", email, "password:", password, "role:", role);
            const response = await axios.post('http://localhost:8000/api/login/', { email, password, role });

            const userRole = response.data.role;
            const token = response.data.token;

            if (userRole === role) {
                localStorage.setItem('authToken', token);
                console.log('Token stored in localStorage:', token);

                if (userRole === 'Admin') {
                    navigate('/admin');
                } else if (userRole === 'Member') {
                    navigate('/member'); // Redirect to member page
                } else {
                    navigate('/'); // Redirect to default page if the role is not recognized
                }
            } else {
                setError('Role mismatch. Please check your role.');
            }
        } catch (err) {
            console.error("Error:", err.response ? err.response.data : err.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Role:
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                    </select>
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default LoginPage;
