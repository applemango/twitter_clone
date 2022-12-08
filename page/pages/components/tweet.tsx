import Link from "next/link"
import { TypeTweet } from "../../lib/types/type"
import { LinkBack, TweetIconLeft, TweetIconLeftBorder, TweetIconLeftBorderAll, TweetIconLeftBorderEnd } from "./components/components"
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

const TweetReplays = ({
    tweet,
    filter = (t: TypeTweet) => t.user_id == tweet.user_id
}:{
    tweet: TypeTweet,
    filter?: Function
}) => {
    const rep = tweet.replay.filter((t) => filter(t))
    if (!rep.length || tweet.content_type== "retweet")
        return <Tweet tweet={tweet} />
    const end = rep[rep.length - 1]
    rep.pop()
    return <div className={styles.replays}>
        <LinkBack href={`/@/${tweet.user.name}/${tweet.id}`}>
            <TweetIconLeftBorder name={tweet.user_icon}>
                <TweetTopOneLine tweet={tweet} />
                <TweetText tweet={tweet} />
                <TweetContent tweet={tweet} />
                <TweetBottomOneLine tweet={tweet} />
            </TweetIconLeftBorder>
        </LinkBack>
        {!!rep.length && rep.map((t) => (
            <LinkBack href={`/@/${t.user.name}/${t.id}`}>
                <TweetIconLeftBorderAll name={t.user_icon}>
                    <TweetTopOneLine tweet={t} />
                    <TweetText tweet={t} />
                    <TweetContent tweet={t} />
                    <TweetBottomOneLine tweet={t} />
                </TweetIconLeftBorderAll>
            </LinkBack>
        ))}
        {end && <LinkBack href={`/@/${end.user.name}/${end.id}`}>
            <TweetIconLeftBorderEnd name={end.user_icon}>
                <TweetTopOneLine tweet={end} />
                <TweetText tweet={end} />
                <TweetContent tweet={end} />
                <TweetBottomOneLine tweet={end} />
            </TweetIconLeftBorderEnd>
        </LinkBack>
        }
    </div>
}

const TweetText = ({tweet}:{tweet: TypeTweet}) => {
    return <div className={styles.text}>
        <p>{tweet.text}</p>
    </div>
}

export {
    Tweet as default,
    TweetText,
    TweetReplays
}