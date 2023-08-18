import { useEffect, useState, useRef } from "react";
import File from "./file";

const Home = () => {
    const [files, setFiles] = useState([]);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        fetch("/api/listfiles").then(res => res.json().then(data => {
            setUsername(data.username);
            setFiles(data.files);
        })).catch(err => console.log(err));
    }, []);

    const deleteFile = filename => {
        fetch(`/api/deletefile/${filename}`)
        .then(() => {
            fetch("/api/listfiles").then(res => res.json().then(data => {
            setUsername(data.username);
            setFiles(data.files);
        })).catch(err => console.log(err));
        }).catch(err => console.log(err));
    };

    const uploadFilesForm = useRef(null);
    const handleChange = event => {
        uploadFilesForm.current.submit();
    };
    
    return (
        <div className="container-fluid">
            {username &&
                <div>
                    <h2>Welcome to High Drive, {username}</h2>
                    <button className="btn btn-outline-dark" onClick={() => {fetch("/api/signout"); setUsername(null) }}>Sign out</button> 
                    <br /><br />
                    <form encType="multipart/form-data" action="/api/upload" method="post" ref={uploadFilesForm} onChange={handleChange}>
                        <div class="mb-3">
                            <label className="fs-3" htmlFor="files">Upload files:</label>
                            <input class="form-control" style={{ maxWidth: "17%" }} name="files" type="file" id="formFileMultiple" multiple/>
                        </div> 
                    </form>
                    <div className="container pt-2 my-5 ">
                        <h3>Your files:</h3>
                        <div className="container"> 
                            <br /> 
                            { 
                                files.map(newFile => {
                                    return (
                                        <File file={newFile} deletefile={deleteFile}/>
                                    );
                                })
                            }
                        <br /> 
                        </div>
                    </div>
                </div>
            }
            { !username &&
                <div>
                    <br />
                    <h2>In order to browse your files, you must log in first.</h2>
                </div>
            }
        </div>
             
    );
};

export default Home;