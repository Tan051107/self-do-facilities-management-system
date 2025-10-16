import { createContext,useState, useEffect} from "react";
import axios from '../js/axios.js'

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem('auth-token');
        if(token){
            axios.get('/user')
            .then(result=>setUser(result.data))
            .catch(()=>{
                setUser(null);
                localStorage.removeItem("auth-token");
                localStorage.removeItem("user-role");
                localStorage.removeItem('user')
            })
        }
    },[])

    return (
        <UserContext.Provider value = {{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}