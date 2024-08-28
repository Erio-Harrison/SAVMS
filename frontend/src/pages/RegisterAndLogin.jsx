import { useContext, useState } from "react";
import axiosInstance from '../axiosInstance';
import { UserContext } from "../UserContext";
import { Logo } from '../assets/Logo';

export default function RegisterAndLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { setId } = useContext(UserContext);

    async function registerOrLogin(e) {
        e.preventDefault();
        const endpoint = isLoginMode ? '/login' : '/register';
        const roleId = (role == 'admin') ? 1 : 2;
        const user = {
            account: username,
            password: password,
            role: roleId
        };

        try {
            const response = await axiosInstance.post(endpoint, user);
            const userId = response.data.data.id;

            setId(userId);
        } catch (err) {
            console.error('Error', err.response ? err.response.data : err.message);
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