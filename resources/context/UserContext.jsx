import { createContext,useState, useEffect} from "react";
import axios from '../js/axios.js'

export const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] =useState(true)

    useEffect(()=>{
        const token = localStorage.getItem('auth-token');
        if(token){
            axios.get('/user')
            .then((result)=>{
                setUser(result.data);
                localStorage.setItem('user',JSON.stringify(result.data))
            })
            .catch(()=>{
                setUser(null);
                localStorage.removeItem("auth-token");
                localStorage.removeItem("user-role");
                localStorage.removeItem('user')
            })
            .finally(()=>setLoading(false))
        }
        else{
            setLoading(false)
        }
    },[])

    return (
        <UserContext.Provider value = {{user,setUser,loading}}>
            {children}
        </UserContext.Provider>
    )
}