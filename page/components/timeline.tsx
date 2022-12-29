import { useEffect, useState } from "react"
import { get_tweet } from "../lib/res/tweet"
import { TypeTweet } from "../lib/types/type"
import { get, getUrl } from "../lib/utils/main"
import Tweets from "./tweets"

const Timeline = ({
    tweets,
    setTweets
}:{
    tweets: Array<TypeTweet>
    setTweets: Function
}) => {
    //const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const [hasMore, setHasMore] = useState(true)
    const [now, setNow] = useState(1)
    /*const requestTweets = async (start: number, end: number) => {
        const res = await get_tweet(start, end)
        console.log(res)
        if(!res)
            return
        setTweets([...tweets, ...res])
    }
    useEffect(() => {
        requestTweets(0, 10)
    },[])*/
    return <Tweets hasMore={hasMore} loadMore={async () => {
        const res = await get(getUrl(`/tweets?p=${now}&limit=${5}`))
        if(!res || !res.data || !res.data.data)
            return
        if(res.data.data.length < 5)
            setHasMore(false)
        setNow(now => now + 1)
        setTweets((tweets: any) => [...tweets, ...res.data.data])
    }}  tweets={tweets} />
}
export default Timeline