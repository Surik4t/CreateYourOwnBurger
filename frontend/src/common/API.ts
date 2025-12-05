import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE

export const get_api_base = (token: string) => {
    return (
        axios.create({
        baseURL: `${BASE_URL}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }})
    )
} 