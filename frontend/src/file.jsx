
const File = props => {
    
    return (
        <div className="col-md-3 bg-light border border-secondary rounded pb-3">
            <h5>{props.file.originname.substring(0, 30)}</h5>
            <div className="pt-4 row gap-3">
                <div className="col-md-4">
                    <form action={`/api/getfile/${props.file.filename}`}> 
                        <button className="btn btn-outline-primary me-2" type="submit">Download</button>
                    </form>
                </div>
                <div className="col-md-1">
                    <button className="btn btn-outline-secondary" onClick={() => props.deletefile(props.file.filename)} type="submit">Delete</button>
                </div> 
            </div>
        </div>
    );
};

export default File;