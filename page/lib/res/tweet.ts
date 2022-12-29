import { get, getUrl, post } from "../utils/main"

export const post_tweet = async (text: string, content: string = "", content_type: string = "") => {
    try {
        const res = await post(getUrl(`/tweets`), {
            text: text,
            content: content,
            content_type: content_type,
        })
        return res.data.tweet
    } catch (e) {
    }
}

export const post_replay = async (id: number, text: string, content: string = "", content_type: string = "") => {
    try {
        const res = await post(getUrl(`/replays`), {
            id: id,
            text: text,
            content: content,
            content_type: content_type,
        })
        return res.data.tweet
    } catch (e) {
    }
}

export const get_tweet = async (start: number | string, end: number | string) => {
    try {
        const res = await get(getUrl(`/tweets`))
        return res.data.data
    } catch (e) {
        
    }
}