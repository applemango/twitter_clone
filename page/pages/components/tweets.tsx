import { TypeTweet } from "../../lib/types/type"
import { ComponentsBorderBottom } from "./components/components"
import Tweet, { TweetReplays } from "./tweet"

const Tweets = ({
    tweets
}:{
    tweets: Array<TypeTweet>
}) => {
    return <>
        <ComponentsBorderBottom>
            {tweets.map((tweet: TypeTweet, i:number) => {
                return <TweetReplays tweet={tweet} />
            })}
        </ComponentsBorderBottom>
    </>
}

export default Tweets