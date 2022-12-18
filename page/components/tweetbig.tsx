import { TypeTweet } from "../lib/types/type"
import { ComponentsBorderBottom, TweetIconLeft, TweetIconLeftBorderEnd } from "./components/components"
import styles from "./sass/tweet.module.scss"
import TweetContent from "./tweetcontent"
import { TweetBottomMultipleLineData, TweetBottomMultipleLineDate, TweetBottomMultipleLineTooltip, TweetBottomOneLine, TweetTopOneLine, TweetTopTwoLine } from "./tweetinfo"
import TweetReplayForm from "./tweetreplayform"
import UserIcon from "./usericon"
import { UserNameMini } from "./userinfo"

const TweetBig = ({
    tweet,
    setReplays=()=>{},
    isReplay
}:{
    tweet: TypeTweet,
    setReplays?: Function,
    isReplay?: boolean
}) => {
    return <>
    <div className={styles.big} style={isReplay ? {paddingTop: 0}:{}}>
        {isReplay ? <div className={styles.TweetTopTwoLine}>
            <TweetIconLeftBorderEnd name={tweet.user.icon} />
            <div style={{paddingTop: 16}}><UserNameMini user={tweet.user} /></div>
        </div> : <TweetTopTwoLine tweet={tweet} />}
        <TweetBigText tweet={tweet} />
        <TweetContent tweet={tweet}/>
        <ComponentsBorderBottom>
            <TweetBottomMultipleLineDate tweet={tweet} />
            <TweetBottomMultipleLineData tweet={tweet} />
            <TweetBottomMultipleLineTooltip tweet={tweet} />
            <TweetReplayForm tweet={tweet} setReplays={setReplays} />
        </ComponentsBorderBottom>
    </div>
    </>
}

const TweetBigText = ({tweet}:{tweet: TypeTweet}) => {
    return <div className={styles.text}>
        <p>{tweet.text}</p>
    </div>
}

export {
    TweetBig as default,
    TweetBigText
}