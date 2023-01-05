import { TypeMessage } from "../types/type"
import { get, getUrl } from "../utils/main"

export const get_messages_user = async () => {
    try {
        const res = await get(getUrl(`/messages/user`))
        return res.data.data
    } catch (e) {
        
    }
}

export const get_messages = async (id: number) => {
    try {
        const res = await get(getUrl(`/messages/${id}?p=${1}&limit=${15}`))
        const msg:Array<TypeMessage> = res.data.data
        return msg
    } catch (e) {

    }
}