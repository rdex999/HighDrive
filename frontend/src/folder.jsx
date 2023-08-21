import { useDroppable } from "@dnd-kit/core";

const Folder = props => {

    const {setNodeRef} = useDroppable({
        id: props.file.originname,
        data: {
            path: props.path
        },
    });

    return(
        <div ref={setNodeRef} className="col-md-2 bg-light border border-secondary rounded pb-3">
            <div className="text-center">
                <button className="btn btn-light" onClick={() => props.changeDirectory(`${props.path}${props.file.originname}/`)}>
                    <img style={{ width: "150px", height: "150px"}} src="folderIcon.png" alt="Image icon" />
                    <h5 className="pt-1">{props.file.originname.substring(0, 18)}</h5>
                </button>
                <div className="pt-3">
                    <button className="btn btn-outline-secondary" onClick={() => props.deleteFolder(props.file.originname, props.path)}>Delete</button>
                </div> 
            </div> 
        </div>
    );
}

export default Folder;