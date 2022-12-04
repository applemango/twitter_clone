import { TypeMessage } from "../../lib/types/type"
import Message from "./message";
import styles from "./sass/messages.module.scss";

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useRef } from "react";

const Messages = ({
    messages
}:{
    messages: Array<TypeMessage> | undefined
}) => {
    const ref = useRef<any>(null)
    useEffect(() => {
        ref.current.scrollBy({
            top: ref.current.scrollHeight + window.innerHeight,
            left: 0,
            behavior: "smooth"
        })
    })
    return <div ref={ref} className={styles.messages}>
        {(!!messages && !!messages.length) && messages.map((message: TypeMessage, i: number) => (
            <Message message={message} />
        ))}
    </div>
}
export default Messages