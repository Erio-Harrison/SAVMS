import React, { useState } from "react";

const TestPage = () => {
    const [files, setFiles] = useState([]);
    const [response, setResponse] = useState("");

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("请先选择文件");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("photos", file); // 注意字段名是 photos
        });

        try {
            const res = await fetch("http://localhost:8080/vehicles/68118a11b4e10c3ef0f1d3b9/upload", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            setResponse(JSON.stringify(result, null, 2));
        } catch (err) {
            setResponse("上传失败: " + err.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>上传多张车辆图片测试</h2>
            <input type="file" onChange={handleFileChange} multiple />
            <button onClick={handleUpload} style={{ marginLeft: "10px" }}>
                上传
            </button>
            <pre style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
                {response}
            </pre>
        </div>
    );
};

export default TestPage;
