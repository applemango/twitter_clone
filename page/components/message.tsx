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
    return <div className={styles.msg}>
        {message.file && <div className={`${me && styles.me}`}><TweetContentImage content={message.file} /></div>}
        <div className={`${me && styles.me}`}>
            <div>
                <div className={`${styles.message}`}>
                    <p>{message.body}</p>
                </div>
                <p className={styles.info}>{dateConversion(message.timestamp)}</p>
            </div>
        </div>
    </div>
}
export default Message