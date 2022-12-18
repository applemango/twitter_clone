import { getUrl } from "../lib/utils/main";
import styles from "./sass/tweetcontent.module.scss"
import Image from "next/image";
import { TypeTweet } from "../lib/types/type";
import Tweet from "./tweet";

const TweetContent = ({
    tweet,
    content,
    contentType
}:{
    tweet?: TypeTweet,
    content?: string,
    contentType?: string
}) => {
    const _content = content ? content : tweet ? tweet.content : "" // content(if not null) -> tweet.content(if not null) -> ""
    const _contentType = contentType ? contentType : tweet ? tweet.content_type : ""
    if(_contentType == "image")
        return <TweetContentImage content={_content} />;
    if (_contentType == "retweet" && tweet)
        return <TweetContentRetweet tweet={tweet} />;
    return <div />
}

const TweetContentImage = ({
    content
}:{
    content: string
}) => {
    const l = getUrl(`/tweets/image/${content}`)
    const loader = () => l
    return <div style={{margin: "12px 0"}} className={styles.imageContainer}>
            <Image
                layout="fill"
                objectFit="contain"
                loader={loader}
                src={l}
                alt={content}
                style={{
                    objectFit: "cover"
                }}
            />
    </div>
}

const TweetContentRetweet = ({
    tweet
}:{
    tweet: TypeTweet
}) => {
    if (!tweet.retweet)
        return <div />
    return <Tweet tweet={tweet.retweet} />
}

export {
    TweetContent as default,
    TweetContentImage
}