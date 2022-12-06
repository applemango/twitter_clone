import Link from "next/link"
import { TypeTweet } from "../../lib/types/type"
import { LinkBack, TweetIconLeft } from "./components/components"
import { IconRetweet } from "./components/icon"
import styles from "./sass/tweet.module.scss"
import TweetContent from "./tweetcontent"
import { TweetBottomOneLine, TweetTopOneLine } from "./tweetinfo"

const Tweet = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    if (tweet.content_type == "retweet" && !tweet.text && tweet.retweet)
        return <div className={styles.retweet}>
            <div className={styles.info}>
                <IconRetweet />
                <p>{`${tweet.user.name} Retweeted`}</p>
            </div>
            <Tweet tweet={tweet.retweet} />
        </div>
    return <div className={styles.main}>
        <LinkBack href={`/@/${tweet.user.name}/${tweet.id}`}>
            <TweetIconLeft name={tweet.user_icon}>
                <TweetTopOneLine tweet={tweet} />
                <TweetText tweet={tweet} />
                <TweetContent tweet={tweet} />
                <TweetBottomOneLine tweet={tweet} />
            </TweetIconLeft>
        </LinkBack>
    </div>
}

const TweetText = ({tweet}:{tweet: TypeTweet}) => {
    return <div className={styles.text}>
        <p>{tweet.text}</p>
    </div>
}

export {
    Tweet as default,
    TweetText
}