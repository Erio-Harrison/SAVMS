import { useContext, useState } from "react";
import axios from 'axios';
import { UserContext } from "../UserContext";
import { Logo } from '../assets/Logo';

export default function RegisterAndLogin() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true);

    const { setId } = useContext(UserContext);

    async function registerOrLogin(e) {
        e.preventDefault();
        if (isLoginMode) {
            // TODO: axios post username and password (login)
            // set id
        } else {
            // TODO: axios post username and password (register)
            // set id
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