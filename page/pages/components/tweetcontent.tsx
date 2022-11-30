import { getUrl } from "../../lib/utils/main";
import styles from "./sass/tweetcontent.module.scss"
import Image from "next/image";

const TweetContent = ({
    contentType,
    content
}:{
    contentType: string
    content: string
}) => {
    if(contentType == "image")
        return <TweetContentImage content={content} />;
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

export {
    TweetContent as default,
    TweetContentImage
}