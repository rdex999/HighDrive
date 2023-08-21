import { useDroppable } from "@dnd-kit/core";

const BackButton = props => {
    const {setNodeRef} = useDroppable({
        id: "back button",
        data: {
            path: props.path,
        },
    });

    const goBack = path => {
        if(path == "/"){
            // just to reload the files
            props.setPath("/");
            return;
        }
        path = path.substring(0, path.length - 1);
        props.setPath(path.replace(path.substring(path.lastIndexOf("/") + 1, path.length), ""));
    }

    return (
        <div ref={setNodeRef}>
            <button onClick={() => goBack(props.path)} className="btn btn-outline-secondary">Go back</button>
        </div>
    );
};

export default BackButton;