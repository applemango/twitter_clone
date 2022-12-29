import { getToken, parseJwt } from "../lib/res/token"
import { TypeMessage } from "../lib/types/type"
import { dateConversion } from "../lib/utils/date"

import styles from "./sass/messages.module.scss"
import { TweetContentImage } from "./tweetcontent"

const Message = ({
    message
}:{
    message: TypeMessage
}) => {
    const me = parseJwt(getToken(true)).sub == message.send.id
    const body = message.body ? message.body.split("\n") : [""]
    return <div className={styles.msg}>
        {message.file && <div className={`${me && styles.me}`}><TweetContentImage content={message.file} /></div>}
        <div className={`${me && styles.me}`}>
            <div>
                <div className={`${styles.message}`}>
                    {!!(body && body.length) && body.map((body: string, i: number) => (
                        <p key={i}>{body}</p>
                    ))}
                </div>
                <p className={styles.info}>{dateConversion(message.timestamp)}</p>
            </div>
        </div>
    </div>
}
export default Message