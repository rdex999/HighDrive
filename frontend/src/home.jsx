import { useEffect, useState, useRef } from "react";

const Home = () => {
    const [files, setFiles] = useState([]);
    const [username, setUsername] = useState(null);
    useEffect(() => {
        fetch("/api/listfiles").then(res => res.json().then(data => {
            setUsername(data.username);
            setFiles(data.files);
        })).catch(err => console.log(err));
    }, []);

    const uploadFilesForm = useRef(null);
    const handleChange = event => {
        uploadFilesForm.current.submit();
    };

    return (
        <div className="container-fluid">
            {username && <h2>Welcome to High Drive, {username}</h2>}
            {username && 
            <div>
                <br />
                <form encType="multipart/form-data" action="/api/upload" method="post" ref={uploadFilesForm} onChange={handleChange}>
                    <div class="mb-3">
                        <input class="form-control" style={{ maxWidth: "17%" }} type="file" id="formFileMultiple" multiple/>
                    </div> 
                </form>    
            </div>
            } 
            <div className="container pt-5 my-5 border">
            
            </div>
        </div>
             
    );
};

export default Home;