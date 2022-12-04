import Link from "next/link"
import { TypeTweet } from "../../lib/types/type"
import { TweetIconLeft } from "./components/components"
import styles from "./sass/tweet.module.scss"
import TweetContent from "./tweetcontent"
import { TweetBottomOneLine, TweetTopOneLine } from "./tweetinfo"

const Tweet = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.main}>
        <Link href={`/@/${tweet.user.name}/${tweet.id}`}>
            <TweetIconLeft name={tweet.user_icon}>
                <TweetTopOneLine tweet={tweet} />
                <TweetText tweet={tweet} />
                <TweetContent content={tweet.content} contentType={tweet.content_type} />
                <TweetBottomOneLine tweet={tweet} />
            </TweetIconLeft>
        </Link>
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