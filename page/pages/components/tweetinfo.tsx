import { TypeTweet } from "../../lib/types/type"
import { dateConversion } from "../../lib/utils/date"
import styles from "./sass/tweet.module.scss"

const IconMessage = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-message-circle-2" width="21" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>
const IconReTweet = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-repeat"           width="21" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" /><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3 -3l3 -3" /></svg>
const IconLike = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-heart"               width="21" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
const IconShare = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-upload"             width="21" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#9e9e9e" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><polyline points="7 9 12 4 17 9" /><line x1="12" y1="4" x2="12" y2="16" /></svg>
export const TweetTopOneLine = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    return <div className={styles.TweetTopOneLine}>
        <p className={styles.username}>{tweet.user_name}</p>
        <div className={styles.info}>
            <p>{"@" + tweet.user_name}</p>
            <p>{dateConversion(tweet.timestamp)}</p>
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
        <Button icon={IconMessage()} text={"5000"}/>
        <Button icon={IconReTweet()} text={"10k"}/>
        <Button icon={IconLike()} text={"100.0k"}/>
        <Button icon={IconShare()} text={""}/>
    </div>
}