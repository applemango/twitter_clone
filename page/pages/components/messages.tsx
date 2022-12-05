import { TypeMessage } from "../../lib/types/type"
import Message from "./message";
import styles from "./sass/messages.module.scss";

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useRef } from "react";
import Header from "./headers";
import { useRouter } from "next/router";

const Messages = ({
    messages,
    setLocation = () => {}
}:{
    messages: Array<TypeMessage> | undefined
    setLocation?: Function
}) => {
    const ref = useRef<any>(null)
    const router = useRouter()
    useEffect(() => {
        ref.current.scrollBy({
            top: ref.current.scrollHeight + window.innerHeight,
            left: 0,
            behavior: "smooth"
        })
    })
    return <div ref={ref} className={styles.messages}>
        <Header onBackClick={() => setLocation(-1)}>
          <h1 style={{
            fontSize: 18,
            margin: 0,
            color: "#222"
          }}>Messages</h1>
        </Header>
        {(!!messages && !!messages.length) && messages.map((message: TypeMessage, i: number) => (
            <Message message={message} />
        ))}
    </div>
}
export default Messages