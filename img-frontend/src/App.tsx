import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type DocInfo = {
    id: number;
    fileName: string;
    owner: string;
    path: string;
};

function App() {
    const [data, setData] = useState<DocInfo[]>([]);
    const [file, setFile] = useState<File | null>(null);


    useEffect(() => {
        async function getDocData() {
            try {
                const response = await axios.get('http://localhost:8080/api/document');
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    console.error('Expected array but got:', response.data);
                }
            } catch (error) {
                console.error('Error fetching document data:', error);
            }
        }

        getDocData();
    }, []);

    function handleFileChange(files: FileList | null) {
        if (files && files.length > 0) {
            setFile(files[0]);
            console.log(files[0]);
        }
    }

    async function uploadFile() {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8080/api/document/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }

    return (
        <div className="App">
            <h1 className={"title"}>Document List</h1>
            <ul className="DocumentList">
                {data.map((item) => (
                    <li key={item.id}>
                        Name: <Link to={`/viewer/${encodeURIComponent(item.fileName)}`}>{item.fileName}</Link>
                        <span> Owner: {item.owner}</span>
                    </li>
                ))}
            </ul>
            <h2>Upload File</h2>
            <input type="file" onChange={(e) => handleFileChange(e.target.files)}/>
            <button onClick={() =>uploadFile()}>Send to API</button>
        </div>
    );
}

export default App;
