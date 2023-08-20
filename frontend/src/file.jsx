
const File = props => {
    
    let imgPath = null;
    switch(props.file.originname.substring(props.file.originname.lastIndexOf(".") + 1)){
        case "pdf":
        case "txt":
        case "doc":
        case "docx":
        case "csv":
            imgPath = "documentIcon.png";
            break;
        case "png":
        case "jpg":
        case "jpeg":
            imgPath = "imageIcon.png";
            break;
        case "mp4":
        case "mkv":
        case "mov":
            imgPath = "videoIcon.png";
            break;
        default:
            imgPath = null;
            break;
    }

    return (
        <div className="col-md-2 bg-light border border-secondary rounded pb-3">    
            <div className="text-center pt-3">
                { imgPath != null ? <img style={{ width: "150px", height: "150px"}} src={imgPath} alt="Image icon" /> : null}
                <h5 className="pt-1">{props.file.originname.substring(0, 18)}</h5>
                <div className="pt-4 row gap-3 ">
                    <div className="col-md-5 justify-content-center">
                        <form action={`/api/getfile/${props.file.filename}`}> 
                            <button className="btn btn-outline-primary me-5" type="submit">Download</button>
                        </form>
                    </div>
                    <div className="col-md-5">
                        <button className="btn btn-outline-secondary" onClick={() => props.deletefile(props.file.filename)} type="submit">Delete</button>
                    </div> 
                </div>
            </div> 
        </div>
    );
};

export default File;