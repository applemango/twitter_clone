import { useEffect, useState } from "react"
import { get_tweet } from "../lib/res/tweet"
import { TypeTweet } from "../lib/types/type"
import Tweets from "./tweets"

const Timeline = ({
    tweets,
    setTweets
}:{
    tweets: Array<TypeTweet>
    setTweets: Function
}) => {
    //const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const requestTweets = async (start: number, end: number) => {
        const res = await get_tweet(start, end)
        console.log(res)
        if(!res)
            return
        setTweets([...tweets, ...res])
    }
    useEffect(() => {
        requestTweets(0, 10)
    },[])
    return <Tweets tweets={tweets} />
}
export default Timeline