import { TypeMessage } from "../../lib/types/type"
import Message from "./message";
import styles from "./sass/messages.module.scss";

import InfiniteScroll from 'react-infinite-scroller';

const Messages = ({
    messages
}:{
    messages: Array<TypeMessage> | undefined
}) => {
    return <div className={styles.messages}>
        {(messages && messages.length) && messages.map((message: TypeMessage, i: number) => (
            <Message message={message} />
        ))}
    </div>
}
export default Messages