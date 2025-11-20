import { useState,useEffect } from "react";
import '../css/Form.css'

export default function SearchableDropDown ({options,value,onSelect}){
    const [search, setSearch] = useState(value);
    const [open,setOpen] = useState(false);

    const filterOptions = options.filter(option =>
        option.subject_name.toLowerCase().includes(search.toLowerCase())
    );
    

    const handleInputChange = (inputSubject) =>{
        setSearch(inputSubject);
        if(!inputSubject){
            onSelect({subject_code:"" , subject_name:""})
        }     
    }

    return(
        <div className="searchable-input-container">
            <input  type="text" 
                    value={search} 
                    onChange={(e)=>handleInputChange(e.target.value)}
                    onClick={()=>setOpen(prev=>(!prev))} 
            /> 
            {
                open && (
                    <ul className="searchable-dropdown-item-container">
                        {
                            filterOptions.length > 0 ? (
                                filterOptions.map((option)=>(
                                    <li className="searchable-dropdown-item"
                                        key={option.subject_code}
                                        onClick={()=>{
                                            setOpen(false);
                                            setSearch(option.subject_name)
                                            onSelect(option)
                                        }}
                                    >
                                        {option.subject_name}
                                    </li>
                                ))
                            ) : (<li className="searchable-dropdown-item">No result found</li>)
                        }
                    </ul>
                    )
            }
        </div>
    )
}