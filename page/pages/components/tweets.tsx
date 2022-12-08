import { TypeTweet } from "../../lib/types/type"
import { ComponentsBorderBottom } from "./components/components"
import Tweet, { TweetReplays } from "./tweet"

const Tweets = ({
    tweets,
    filter
}:{
    tweets: Array<TypeTweet>,
    filter?: Function
}) => {
    return <>
        <ComponentsBorderBottom>
            {tweets.map((tweet: TypeTweet, i:number) => {
                return <TweetReplays filter={filter} tweet={tweet} />
            })}
        </ComponentsBorderBottom>
    </>
}

export default Tweets