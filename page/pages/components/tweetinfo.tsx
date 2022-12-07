import { TypeTweet } from "../../lib/types/type"
import { dateConversion } from "../../lib/utils/date"
import styles from "./sass/tweet.module.scss"
import UserIcon from "./usericon"
import { UserNameHover, UserNameMini } from "./userinfo"
import { IconLike, IconRetweet, IconMessages, IconShare, IconReplay } from "./components/icon"
import { getUrl, post } from "../../lib/utils/main"
import { post_tweet } from "../../lib/res/tweet"
import { LinkBack } from "./components/components"
export const TweetTopOneLine = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetTopOneLine}>
        <UserNameHover user={tweet.user}>
            <p className={styles.username}>{tweet.user_name}</p>
        </UserNameHover>
        {/*<LinkBack href={`/@/${tweet.user.name}`}>
            <p className={styles.username}>{tweet.user_name}</p>
            </LinkBack>*/}
        <div className={styles.info}>
            <p>{"@" + tweet.user_name}</p>
            <p>{dateConversion(tweet.timestamp)}</p>
        </div>
    </div>
}

export const TweetTopTwoLine = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetTopTwoLine}>
        <UserIcon name={tweet.user.icon} width={48} height={48} />
        <UserNameMini user={tweet.user} />
    </div>
}

export const InfoTopOneLine = ({
    name,
    timestamp
}:{
    name: string
    timestamp: string | number | Date
}) => {
    return <div className={styles.TweetTopOneLine}>
        <p className={styles.username}>{name}</p>
        <div className={styles.info}>
            <p>{"@" + name}</p>
            <p>{dateConversion(timestamp)}</p>
        </div>
    </div>
}

export const TweetBottomOneLine = ({
    tweet
}: {
    tweet: TypeTweet
}) => {
    const Button = ({icon, text}:{icon: any, text?: string}) => {
        return <div className={styles.button}>
            <div>{icon}</div>
            <p>{text}</p>
        </div>
    }
    return <div className={styles.TweetBottomOneLine}>
        <Button icon={IconReplay()} text={tweet.replays.toString()}/>
        <Button icon={IconRetweet()} text={tweet.retweets.toString()}/>
        <Button icon={IconLike()} text={tweet.likes.toString()}/>
        <Button icon={IconShare()} text={""}/>
    </div>
}

export const TweetBottomMultipleLineDate = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetBottomMultipleLineDate}>
        <p>{tweet.timestamp}</p>
    </div>
}

export const TweetBottomMultipleLineData = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetBottomMultipleLineData}>
        <p><span>{tweet.retweets.toString()}</span> Retweets</p>
        <p><span>{tweet.quoteTweets.toString()}</span> Quote Tweets</p>
        <p><span>{tweet.likes.toString()}</span> Likes</p>
    </div>
}

export const TweetBottomMultipleLineTooltip = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    const Button = ({icon,onClick=()=>{}}:{icon:any,onClick?:Function}) => {
        return <div onClick={() => onClick()} className={styles.button}>
            <div>
                {icon}
            </div>
        </div>
    }
    return <div className={styles.TweetBottomMultipleLineTooltip}>
        <Button icon={IconReplay()} />
        <Button onClick={async () => {
            const res = await post_tweet("", String(tweet.id), "retweet")
        }} icon={IconRetweet()} />
        <Button onClick={async ()=> {
            const res = await post(getUrl(`/tweets/${tweet.id}/like`))
        }} icon={IconLike()}    />
        <Button icon={IconShare()}   />
    </div>
}