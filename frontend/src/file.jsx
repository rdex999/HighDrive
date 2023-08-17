import download from "downloadjs";

const File = props => {
    const downloadFile = () => {
        fetch(`/api/getfile/${props.file.filename}`)
        .then(res => res.blob().then(blob => download(blob, props.file.originname)))
        .catch(err => console.log(err));
    };

    return (
        <div>
            <h4>{props.file.originname}</h4>
            <button className="btn btn-outline-primary me-2" onClick={downloadFile} type="submit">Download</button>
            <button className="btn btn-outline-secondary" onClick={() => props.deletefile(props.file.filename)} type="submit">Delete</button>
            <br /><br />
        </div> 
    );
};

export default File;