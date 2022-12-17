import { TypeTweet } from "../../lib/types/type"
import { dateConversion } from "../../lib/utils/date"
import styles from "./sass/tweet.module.scss"
import UserIcon from "./usericon"
import { UserNameHover, UserNameMini } from "./userinfo"
import { IconLike, IconRetweet, IconMessages, IconShare, IconReplay } from "./components/icon"
import { getUrl, post } from "../../lib/utils/main"
import { post_tweet } from "../../lib/res/tweet"
import { LinkBack } from "./components/components"
import { useEffect, useState } from "react"
export const TweetTopOneLine = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetTopOneLine}>
        <UserNameHover user={tweet.user}>
            <p className={styles.username}>{tweet.user.name_display ? tweet.user.name_display : tweet.user.name}</p>
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
    name_display,
    timestamp
}:{
    name: string
    name_display: string
    timestamp: string | number | Date
}) => {
    return <div className={styles.TweetTopOneLine}>
        <p className={styles.username}>{name_display}</p>
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
    const [replay, setReplay] = useState(tweet.replayed)
    const [retweet, setRetweet] = useState(tweet.retweeted)
    const [like, setLike] = useState(tweet.liked)
    const Button = ({icon,onClick=()=>{},text,color,active}:{icon:any,onClick?:Function,text: string,color?:string,active?:boolean}) => {
        return <div style={{width: "25%"}}>
            <div onClick={(e: any) => onClick(e)} style={{"--color-": `${color}1a` ?? "#eee"} as React.CSSProperties} className={`${active ? styles.active : ""} ${styles.button}`}>
                <div style={{"--color": color ?? "#9e9e9e"} as React.CSSProperties}>
                    {icon}
                </div>
                <p style={{"--color": color ?? "#9e9e9e"} as React.CSSProperties}>{text}</p>
            </div>
        </div>
    }
    useEffect(() => {
        setLike(tweet.liked)
        setRetweet(tweet.retweeted)
        setReplay(tweet.replayed)
    },[tweet])
    return <div className={styles.TweetBottomOneLine}>
        <Button active={replay} color={"#1d9bf0"}  icon={IconReplay()} text={tweet.replays.toString()}/>
        <Button active={retweet} color={"#00ba7c"} onClick={async (e: any) => {
            e.preventDefault();
            const res = await post_tweet("", String(tweet.id), "retweet")
            if(!res) {
                setRetweet(false)
                return
            }
            setRetweet(true)
        }} icon={IconRetweet()} text={tweet.retweets.toString()}/>
        <Button active={like} color={"#f91880"} onClick={async (e: any)=> {
            e.preventDefault();
            const res = await post(getUrl(`/tweets/${tweet.id}/like`))
            setLike(res.data.data.like)
        }}  icon={IconLike()} text={tweet.likes.toString()}/>
        <Button color={"#1d9bf0"}  icon={IconShare()} text={""}/>
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
    const [replay, setReplay] = useState(tweet.replayed)
    const [retweet, setRetweet] = useState(tweet.retweeted)
    const [like, setLike] = useState(tweet.liked)
    const Button = ({icon,onClick=()=>{},color,active}:{icon:any,onClick?:Function,color?:string,active?:boolean}) => {
        return <div style={{"--color-": `${color}1a` ?? "#eee"} as React.CSSProperties} onClick={() => onClick()} className={`${active ? styles.active : ""} ${styles.button}`}>
            <div style={{"--color": color ?? "#9e9e9e"} as React.CSSProperties}>
                {icon}
            </div>
        </div>
    }
    useEffect(() => {
        setLike(tweet.liked)
        setRetweet(tweet.retweeted)
        setReplay(tweet.replayed)
    },[tweet])
    return <div className={styles.TweetBottomMultipleLineTooltip}>
        <Button active={replay} color={"#1d9bf0"} icon={IconReplay()} />
        <Button active={retweet} color={"#00ba7c"} onClick={async () => {
            const res = await post_tweet("", String(tweet.id), "retweet")
            if(!res) {
                setRetweet(false)
                return
            }
            setRetweet(true)
        }} icon={IconRetweet()} />
        <Button active={like} color={"#f91880"} onClick={async ()=> {
            const res = await post(getUrl(`/tweets/${tweet.id}/like`))
            setLike(res.data.data.like)
        }} icon={IconLike()}    />
        <Button color={"#1d9bf0"} icon={IconShare()}   />
    </div>
}