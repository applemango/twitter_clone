import { TypeTweet } from "../../lib/types/type"
import { ComponentsBorderBottom, TweetIconLeft } from "./components/components"
import styles from "./sass/tweet.module.scss"
import TweetContent from "./tweetcontent"
import { TweetBottomMultipleLineData, TweetBottomMultipleLineDate, TweetBottomMultipleLineTooltip, TweetBottomOneLine, TweetTopOneLine, TweetTopTwoLine } from "./tweetinfo"
import TweetReplayForm from "./tweetreplayform"
import UserIcon from "./usericon"
import { UserNameMini } from "./userinfo"

const TweetBig = ({
    tweet,
    setReplays=()=>{}
}:{
    tweet: TypeTweet,
    setReplays?: Function
}) => {
    console.log(tweet)
    return <div className={styles.big}>
        <TweetTopTwoLine tweet={tweet} />
        <TweetBigText tweet={tweet} />
        <TweetContent tweet={tweet}/>
        <ComponentsBorderBottom>
            <TweetBottomMultipleLineDate tweet={tweet} />
            <TweetBottomMultipleLineData tweet={tweet} />
            <TweetBottomMultipleLineTooltip tweet={tweet} />
            <TweetReplayForm tweet={tweet} setReplays={setReplays} />
        </ComponentsBorderBottom>
    </div>
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