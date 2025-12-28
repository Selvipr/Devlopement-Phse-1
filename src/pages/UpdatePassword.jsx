import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function UpdatePassword() {
    const { updatePassword, user, session } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        console.log("UpdatePassword mounted");
        console.log("User:", user);
        console.log("Session:", session);
        console.log("Window Hash:", window.location.hash);
    }, [user, session]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("HandleSubmit called. User active?", !!user);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log("Calling updatePassword...");
            const result = await updatePassword(password);
            console.log("updatePassword result:", result);
            setSuccess(true);
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (err) {
            console.error("Error updating password:", err);
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary px-4">
                <div className="max-w-md w-full bg-surface/50 border border-green-500/20 rounded-2xl p-8 text-center shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <FaCheckCircle className="text-6xl text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Password Updated!</h2>
                    <p className="text-gray-300">Your password has been changed successfully. You will be redirected shortly.</p>
                </div>
            </div>
        );
    }

    // DEBUG RENDER START
    // This temporarily replaces the real UI
    // ...

    // DEBUG RENDER
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-10">
            <div className="border border-red-500 p-5">
                <h1 className="text-3xl font-bold text-red-500">DEBUG MODE</h1>
                <p>UpdatePassword Component Mounted.</p>
                <p>User: {user ? user.email : 'NULL'}</p>
                <p>Session: {session ? 'ACTIVE' : 'NULL'}</p>
            </div>
        </div>
    );

    /* 
    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-4">
            ... original UI ...
        </div>
    );
    */
}
