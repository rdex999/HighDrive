import download from "downloadjs";

const File = props => {

    const downloadFile = () => {
        fetch(`/api/getfile/${props.file.filename}`)
        .then(res => res.blob().then(blob => download(blob, props.file.originname)))
        .catch(err => console.log(err));
    };

    return (
        <div>
            <div className="container border me-3 float-start" style={{ width: "25%" }}>
                <h5>{props.file.originname.substring(0, 30)}</h5>
                <div className="pt-3 pb-3">
                    <button className="btn btn-outline-primary me-2" onClick={downloadFile} type="submit">Download</button>
                    <button className="btn btn-outline-secondary" onClick={() => props.deletefile(props.file.filename)} type="submit">Delete</button>
                </div>
            </div>
        </div> 
    );
};

export default File;