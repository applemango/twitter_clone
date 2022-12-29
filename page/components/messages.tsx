import { TypeMessage } from "../lib/types/type"
import Message from "./message";
import styles from "./sass/messages.module.scss";

import InfiniteScroll from 'react-infinite-scroller';
import { useEffect, useRef, useState } from "react";
import Header from "./headers";
import { useRouter } from "next/router";
import { get, getUrl } from "../lib/utils/main";

const Messages = ({
    messages,
    location,
    setLocation = () => {},
    setMessages = () => {}
}:{
    messages: Array<TypeMessage>
    location: number
    setLocation?: Function
    setMessages?: Function
}) => {
    const ref = useRef<any>(null)
    const router = useRouter()
    const [now, setNow] = useState(2)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState<Array<TypeMessage>>([])
    useEffect(() => {
        ref.current.scrollBy({
            top: ref.current.scrollHeight + window.innerHeight,
            left: 0,
            behavior: "smooth"
        })
    },[messages])
    return <div ref={ref} className={styles.messages}>
        <Header onBackClick={() => setLocation(-1)}>
          <h1 style={{
            fontSize: 18,
            margin: 0,
            color: "#222"
          }}>Messages</h1>
        </Header>
        <InfiniteScroll
            pageStart={2}
            loadMore={async () => {
                const res = await get(getUrl(`/messages/${location}?p=${now}&limit=${15}`))
                if(!res || !res.data || !res.data.data)
                    return
                if(res.data.data.length < 15)
                    setHasMore(false)
                setNow(now => now + 1)
                setLoadingMessages((messages) => [...res.data.data.reverse(),...messages])
            }}
            hasMore={hasMore}
            useWindow={false}
            isReverse={true}
        >
            <div>
                {(!![...loadingMessages,...messages] && !![...loadingMessages,...messages].length) && [...loadingMessages,...messages].map((message: TypeMessage, i: number) => (
                    <Message key={i} message={message} />
                ))}
            </div>
        </InfiniteScroll>
    </div>
}
export default Messages