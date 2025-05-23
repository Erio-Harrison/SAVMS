import { useContext, useState } from "react";
import axiosInstance from '../axiosInstance';
import { UserContext } from "../UserContext";
import { Logo } from '../assets/Logo';
import {json} from "react-router-dom";
import { useEffect } from "react";

export default function RegisterAndLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const { setId } = useContext(UserContext);

    useEffect(() => {
        if(message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    async function registerOrLogin(e) {
        e.preventDefault();
        if (isLoginMode){
            const endpoint = isLoginMode ? '/api/auth/login' : '/users/create';
            var reqlogin = {
                username: username,
                password: password,
                role: role === 'admin' ? 0 : 1
            };
            try{
                const response = await axiosInstance.post(endpoint, reqlogin);
                const { code, msg, data } = response.data;

                if(code !== 1) {
                    setMessage(msg || 'Login failed.');
                    setMessageType('error');
                    return;
                }

                // Success case
                const userId = data.id;
                const token = data.token;
                const userData = {
                    id: userId,
                    username: username,
                    email: data.email,
                    token: token,
                    role: data.role
                };

                localStorage.setItem("user", JSON.stringify(userData));
                setId(userId);
                setRole(data.role);
            }
            catch (err) {
                const errMsg = 'Login failed.';
                setMessage(errMsg);  // set message for display
                setMessageType('error');
            }



        }else{
            const endpoint = '/users/create';
            const roleId = (role == 'admin') ? 0 : 1;
            const user = {
                username: username,
                password: password,
                email: email,
                role: 1
            };
            try {
                await axiosInstance.post(endpoint, user);
                setMessage('Registration successful. You can now log in.');
                setMessageType('success');
            } catch (err) {
                const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
                console.error('Registration Error:', errMsg);
                setMessage(errMsg);
                setMessageType('error');
            }
        }
    }

    function toggleMode() {
        setIsLoginMode(prevMode => !prevMode);
    }

    return (
        <div className="bg-primary h-screen flex items-center font-sans">
            <div className="w-96 mx-auto text-center mb-20">
                <h1 className="text-3xl font-sans font-semibold text-black mb-3">SCUVMS</h1>
                <Logo />
                {message && (
                    <div
                        className={`mb-4 text-sm p-2 rounded-full ${
                            messageType === 'error'
                                ? 'text-red-600 bg-red-100'
                                : 'text-green-600 bg-green-100'
                        }`}
                    >
                        {message}
                    </div>
                )}
                <form onSubmit={registerOrLogin}>
                    <input
                        type="text"
                        placeholder="username"
                        className="block w-full rounded-full px-4 py-2 mb-6 focus:outline-none bg-secondary"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        className="block w-full rounded-full px-4 py-2 mb-6 focus:outline-none bg-secondary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLoginMode && (
                        <input
                            type="email"
                            placeholder="email"
                            className="block w-full rounded-full px-4 py-2 mb-6 focus:outline-none bg-secondary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                    {isLoginMode && (
                        <div className="relative mb-6">
                            <select
                                className="block w-full rounded-full px-4 py-2 pr-10 focus:outline-none bg-secondary appearance-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-accent block w-full rounded-full p-2 mb-6 text-gray-darkest font-semibold"
                    >
                        {isLoginMode ? 'Login' : 'Register'}
                    </button>
                    <div className="text-black text-sm">
                        {isLoginMode ? 'Do not have an account? ' : 'Already have an account? '}
                        <button className="underline" type="button" onClick={toggleMode}>
                            {isLoginMode ? 'Register here' : 'Login here'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}