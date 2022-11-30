import axios from "axios";
import { getUrl } from "../utils/main";
import { getToken, isLoginAndLogin } from "./token";

export const post_image = async (file: File) => {
    const login = await isLoginAndLogin()
    if(login) {
        try {
            const formData = new FormData();
            formData.append("file", file)
            const res = await axios.post(
                getUrl("/tweets/image"),
                formData, {
                    headers: {
                        "Content-Type": "multipart/form-data;"
                        ,'Authorization': 'Bearer '+getToken()
                    }
                }
            )
            return res.data
        } catch (error: any) {
            return false
        }
    }
    return false
}