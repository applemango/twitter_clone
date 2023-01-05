import { get, getUrl } from "../utils/main"

export const get_user = async (name: string) => {
    try {
        if(!name)
            throw new Error("NoName");
        const res = await get(getUrl(`/user/${name}`))
        return res.data.data
    } catch (e) {
        
    }
}