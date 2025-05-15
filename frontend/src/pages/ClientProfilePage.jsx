import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { Button, Input, Toast } from "@douyinfe/semi-ui";

export default function ClientProfilePage() {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState({
        id: "",
        username: "",
        email: "",
    });

    const [editing, setEditing] = useState(false);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (storedUser) {
            setUser({
                id: storedUser.id,
                username: storedUser.username || "",
                email: storedUser.email || "",
            });
        }
    }, []);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleSaveEmail = async () => {
        try {
            const newEmail = emailInputRef.current.value;

            if (newEmail === user.email) {
                Toast.info("No changes made to the email.");
                return;
            }

            await axiosInstance.put(`/users/${user.id}/updateEmail`, null, {
                params: { newEmail: newEmail },
            });

            const updatedUser = { ...user, email: newEmail };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            Toast.success("Email updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            Toast.error("Failed to update email.");
        }
    };

    const handleSavePassword = async () => {
        try {
            const newPassword = passwordInputRef.current.value;

            if (!newPassword) {
                Toast.info("Please enter a new password.");
                return;
            }

            await axiosInstance.put(`/users/${user.id}/updatePassword`, null, {
                params: { newPassword: newPassword },
            });

            Toast.success("Password updated successfully!");
        } catch (error) {
            console.error("Update failed", error);
            Toast.error("Failed to update password.");
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="text-white w-full max-w-xl bg-black p-8 rounded-3xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">Client Profile</h2>

                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">User ID</label>
                    <div className="bg-gray-800 px-4 py-2 rounded">{user.id}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">Username</label>
                    <div className="bg-gray-800 px-4 py-2 rounded">{user.username}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    {editing ? (
                        <Input
                            name="email"
                            defaultValue={user.email}
                            ref={emailInputRef}
                            placeholder="Enter new email"
                            style={{ backgroundColor: "white", color: "black" }}
                        />
                    ) : (
                        <div className="bg-gray-800 px-4 py-2 rounded">{user.email}</div>
                    )}
                </div>

                {editing && (
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300 mb-1">New Password</label>
                        <Input
                            type="password"
                            ref={passwordInputRef}
                            placeholder="Enter new password"
                            style={{ backgroundColor: "white", color: "black" }}
                        />
                    </div>
                )}

                <div className="flex justify-end mt-6 gap-2">
                    {editing ? (
                        <>
                            <Button theme="solid" type="primary" onClick={handleSaveEmail}>
                                Save Email
                            </Button>
                            <Button theme="solid" type="primary" onClick={handleSavePassword}>
                                Save Password
                            </Button>
                            <Button onClick={handleEditToggle}>Cancel</Button>
                        </>
                    ) : (
                        <Button theme="solid" onClick={handleEditToggle}>Edit</Button>
                    )}
                </div>
            </div>
        </div>
    );
}