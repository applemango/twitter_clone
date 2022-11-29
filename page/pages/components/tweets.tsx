import { TypeTweet } from "../../lib/types/type"
import { ComponentsBorderBottom } from "./components/components"
import Tweet from "./tweet"

const Tweets = ({
    tweets
}:{
    tweets: Array<TypeTweet>
}) => {
    return <>
        <ComponentsBorderBottom>
            {tweets.map((tweet: TypeTweet, i:number) => {
                return <Tweet tweet={tweet} />
            })}
        </ComponentsBorderBottom>
    </>
}

export default Tweets