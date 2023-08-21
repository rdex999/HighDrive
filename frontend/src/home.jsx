import { useEffect, useState, useRef } from "react";
import { DndContext, rectIntersection, MouseSensor, useSensor, useSensors} from "@dnd-kit/core";
import File from "./file";
import Folder from "./folder";
import BackButton from "./backButton";

const Home = () => {
    const [files, setFiles] = useState([]);
    const [username, setUsername] = useState(null);
    const [path, setPath] = useState("/");
    const [newDirName, setNewDirName] = useState("");
    const [createDirMsg, setCreateDirMsg] = useState("");

    useEffect(() => {
        reloadFiles(setUsername, setFiles);
    }, [path]);

    const deleteFile = filename => {
        fetch(`/api/deletefile/${filename}`)
        .then(() => {
            reloadFiles(setUsername, setFiles);
        }).catch(err => console.log(err));
    };

    const uploadFilesForm = useRef(null);
    const handleChange = event => {
        uploadFilesForm.current.submit();
    };

    const handleDragEnd = event => {
        if(event.over){
            if(path == "/" && event.over.id == "back button"){
                reloadFiles(setUsername, setFiles);
                return;
            }
            fetch("/api/changefilepath", {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    filename: event.active.id,
                    folder: event.over.id,
                    path: path,
                }),
            }).then(res => res.json()).then(data => {
                reloadFiles(setUsername, setFiles);
            }).catch(err => {
                console.log(err);
            })
        }
    };
   
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });
    const sensors = useSensors(mouseSensor);

    const reloadFiles = (setUsrname, setUsersFiles) => {
        fetch("/api/listfiles").then(res => res.json().then(data => {
            setUsrname(data.username);
            setUsersFiles(data.files);
        })).catch(err => console.log(err));
    }

    const handleCreateDirSubmit = event => {
        event.preventDefault();
        fetch(`/api/createfolder/?path=${path}`, {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderName: newDirName
            })
        }).then(res => res.json()).then(jsonData => {
            if(jsonData.state === 1){
                reloadFiles(setUsername, setFiles);
                setCreateDirMsg(
                    <div>
                        <br />
                        <p style={{ maxWidth: "17%"}} className="border border-success text-success">Created directory successfully!</p>
                    </div>
                );
            }else if(jsonData.state === 0){
                reloadFiles(setUsername, setFiles);
                setCreateDirMsg(
                    <div>
                        <br />
                        <p style={{ maxWidth: "17%"}} className="border border-danger text-danger">Directory {newDirName} already exists.</p>
                    </div>     
                );
            }
        })
    };

    const deleteFolder = (folderName, foldersPath) => {
        fetch("/api/deleteFolder", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                folderName: folderName,
                path: foldersPath 
            })
        }).then(res => res.json()).then(data => {
            reloadFiles(setUsername, setFiles);
            console.log(data);
        }).catch(err => console.log(err));
    };

    return (
        <div className="container-fluid">
            {username &&
                <div>
                    <h2>Welcome to High Drive, {username}</h2>
                    <button className="btn btn-outline-dark" onClick={() => {fetch("/api/signout"); setUsername(null) }}>Sign out</button> 
                    <br /><br />
                    <form encType="multipart/form-data" action={`/api/upload/?path=${path}`} method="post" ref={uploadFilesForm} onChange={handleChange}>
                        <div class="mb-3">
                            <label className="fs-3" htmlFor="files">Upload files:</label>
                            <input class="form-control" style={{ maxWidth: "17%" }} name="files" type="file" id="formFileMultiple" multiple/>
                        </div> 
                    </form>
                    <form onSubmit={handleCreateDirSubmit} className="input-group">
                        <button className="btn btn-light" type="submit">Create folder</button>
                        <input onChange={event => setNewDirName(event.target.value)} style={{maxWidth: "17%"}} className="form-control" name="folderName" placeholder="Folder name" type="text" />
                    </form>
                    {createDirMsg}
                    <div className="container pt-2 my-5 ">
                        <DndContext collisionDetection={rectIntersection} onDragEnd={handleDragEnd} sensors={sensors}>
                            <div className="row">
                                <div className="col-md-1">
                                    <BackButton setPath={setPath} path={path}/> 
                                </div> 
                                <div className="col-md-1"> 
                                    <h4>path:</h4>
                                </div>
                                <div className="col-md-1">
                                    <h4>{path}</h4>
                                </div>
                            </div> 
                            <br />
                            <h3>Your files:</h3>
                            <br />
                            <div className="container">
                                <div className="row gap-4"> 
                                    { 
                                        files.map(newFile => {
                                            if(newFile.path === path){
                                                if(newFile.filename != null){
                                                    return (
                                                        <File file={newFile} deletefile={deleteFile} />
                                                    );
                                                }else{
                                                    return (
                                                        <Folder file={newFile} changeDirectory={setPath} path={path} deleteFolder={deleteFolder}/>
                                                    );
                                                }
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </DndContext>
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