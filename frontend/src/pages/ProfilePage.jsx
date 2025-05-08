import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Form, Button, Input, Toast } from "@douyinfe/semi-ui";

export default function ProfilePage() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState({
        id: "",
        username: "",
        email: ""
    });
    const [editing, setEditing] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(() => {
        if (storedUser) {
            setUser({
                id: storedUser.id,
                username: storedUser.username || "",
                email: storedUser.email || ""
            });
            setFormValues({
                username: storedUser.username || "",
                email: storedUser.email || ""
            });
        }
    }, []);

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axiosInstance.put(`/users/${user.id}/updateEmail?newEmail=${formValues.email}`);
            await axiosInstance.put(`/users/${user.id}/updateUsername?newUsername=${formValues.username}`);

            const updatedUser = { ...user, ...formValues };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            Toast.success("Profile updated successfully!");
            setEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            Toast.error("Failed to update profile.");
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
                    {editing ? (
                        <Input
                            name="username"
                            value={formValues.username}
                            onChange={handleChange}
                            placeholder="Enter new username"
                        />
                    ) : (
                        <div className="bg-gray-800 px-4 py-2 rounded">{user.username}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    {editing ? (
                        <Input
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            placeholder="Enter new email"
                        />
                    ) : (
                        <div className="bg-gray-800 px-4 py-2 rounded">{user.email}</div>
                    )}
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    {editing ? (
                        <>
                            <Button theme="solid" type="primary" onClick={handleSave}>
                                Save
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
