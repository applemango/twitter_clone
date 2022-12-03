import { get, getUrl } from "../utils/main"

export const get_user = async (name: string) => {
    try {
        const res = await get(getUrl(`/user/${name}`))
        return res.data.data
    } catch (e) {
        
    }
}