import InfiniteScroll from "react-infinite-scroller"
import { TypeTweet } from "../lib/types/type"
import { ComponentsBorderBottom } from "./components/components"
import Tweet, { TweetReplays } from "./tweet"

const Tweets = ({
    tweets,
    filter,
    loadMore = () => {},
    hasMore = false
}:{
    tweets: Array<TypeTweet>,
    filter?: Function,
    loadMore?: Function,
    hasMore?: boolean,

}) => {
    return <>
        <ComponentsBorderBottom>
            <InfiniteScroll
                pageStart={2}
                loadMore={async () => await loadMore()}
                hasMore={hasMore}
                useWindow={true}
            >
                {!!tweets && tweets.map((tweet: TypeTweet, i:number) => (
                    <TweetReplays key={i} filter={filter} tweet={tweet} />
                ))}
            </InfiniteScroll>
        </ComponentsBorderBottom>
    </>
}

export default Tweets