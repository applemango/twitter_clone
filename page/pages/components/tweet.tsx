import { TypeTweet } from "../../lib/types/type"
import { TweetIconLeft } from "./components/components"
import styles from "./sass/tweet.module.scss"
import { TweetBottomOneLine, TweetTopOneLine } from "./tweetinfo"

const Tweet = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.main}>
        <TweetIconLeft>
            <TweetTopOneLine tweet={tweet} />
            <TweetText tweet={tweet} />
            <TweetBottomOneLine tweet={tweet} />
        </TweetIconLeft>
    </div>
}

const TweetText = ({tweet}:{tweet: TypeTweet}) => {
    return <div className={styles.text}>
        <p>{tweet.text}</p>
    </div>
}

export {
    Tweet as default,
}