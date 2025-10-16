import axios from './axios.js'

export async function fetchNotifications(){
    try{
        const result = await axios.get('/announcement');
        console.log(result.data)
        return result.data
    }
    catch(err){
        console.error('Failed to fetch announcements',err)
        return []
    }
}