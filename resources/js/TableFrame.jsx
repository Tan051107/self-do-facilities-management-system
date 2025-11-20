
export default function TableFrame({headers,children}){
    return(    
        <table className="management-timetable" border="1" cellPadding="12">
            <thead>
                <tr>
                    {
                        headers.map((header,index)=>(
                            <th key={index}>{header}</th>
                        ))
                    }
                </tr>
            </thead>
            {children}
        </table>
        )
}