import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function FileViewer() {
    const { fileName } = useParams<{ fileName: string }>();
    const [fileBlob, setFileBlob] = useState<Blob | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [textContent, setTextContent] = useState<string | null>(null);

    useEffect(() => {
        async function fetchFile() {
            try {
                const response = await axios.get(`http://localhost:8080/api/document/${fileName}`, {
                    responseType: 'blob',
                });

                const blob = response.data;
                const url = URL.createObjectURL(blob);
                setFileBlob(blob);
                setFileUrl(url);
                setFileType(blob.type);

                if (blob.type === 'application/json' || blob.type === 'text/plain') {
                    const text = await blob.text();
                    setTextContent(text);
                }
            } catch (err) {
                console.error('Error fetching file:', err);
            }
        }

        fetchFile();
    }, [fileName]);

    if (!fileBlob || !fileUrl || !fileType) return <p>Loading...</p>;

    if (fileType === 'application/pdf') {
        return (
            <>
                <iframe src={fileUrl} width="900px" height="900px" />;
                <Link to="/">← Back to Document List</Link>
            </>
        )
    }

    if (fileType === 'application/json') {
        try {
            return <pre>{JSON.stringify(JSON.parse(textContent!), null, 2)}</pre>;
        } catch {
            return <pre>{textContent}</pre>;
        }
    }

    if (fileType === 'text/plain') {
        return <pre>{textContent}</pre>;
    }

    if (fileType.startsWith('image/')) {
        return <img src={fileUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />;
    }

    if (
        fileType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return (
            <>
                <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
                    width="100%"
                    height="600px"
                />
                <Link to="/">← Back to Document List</Link>
            </>

        );
    }

    return (
        <div>
            <p>Unsupported file type: {fileType}</p>
            <a href={fileUrl} download>
                Download File
            </a>
            <br />
            <Link to="/">← Back to Document List</Link>
        </div>
    );
}

export default FileViewer;
