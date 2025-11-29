import '../css/Form.css'

export default function FormFrame({title,children,addButtonLabel,addButtonFunction,cancelButtonFunction}){
    return(
        <div className = "add-things-container">
            <div className = "add-things-section">
                <span className="material-symbols-rounded x-icon-container" onClick={()=>cancelButtonFunction()}>close</span>
                <h1>{title}</h1>
                <form action="" className="add-edit-form">
                    {children}
                </form>
                <div className="add-cancel-btn-section">
                    <button className="add-btn" onClick={()=>addButtonFunction()}>{addButtonLabel}</button>
                    <button className="cancel-btn" onClick={()=>cancelButtonFunction()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}