import { useEffect, useState } from "react"
import Messages from "./messages"

import { TypeMessage } from "../../lib/types/type"
import { get_messages } from "../../lib/res/messages"
import MessagesForm from "./messagesform"

import styles from "./sass/messages.module.scss";
import { getToken, isLoginAndLogin } from "../../lib/res/token"
import Headers from "./headers"
import Header from "./headers"

const MessagesChat = ({
    socket,
    location,
    setLocation = () => {}
}:{
    socket: any,
    location: number
    setLocation?: Function
}) => {
    const [messages, setMessages] = useState<Array<TypeMessage>>()
    useEffect(() => {
        const r = async () => {
            if(location==-1)
                return
            const res = await get_messages(location)
            if(!res)
                return
            setMessages(res)
        }
        r()
    },[location])
    useEffect(() => {
        socket.on("message_from_user", (msg: any) => {
            if(messages && (messages[messages.length - 1].id == msg.id))
                return
            setMessages((messages) => messages ? [...messages, msg]: [msg])
        })
        socket.on("message_to_user", (msg:any) => {
            if(messages && (messages[messages.length - 1].id == msg.id))
                return
            setMessages((messages) => messages ? [...messages, msg]: [msg])
        })
    },[])
    if(location == -1)
        return <div className={`${styles.chat} ${styles.none}`} style={{width: "calc(100% - 350px)"}}>
            <div>
                <p>Select a message</p>
                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                <button>New message</button>
            </div>
        </div>
    return <>
        <div className={styles.chat} style={{width: "calc(100% - 350px)"}}>
            <Messages setLocation={setLocation} messages={messages} />
            <MessagesForm onSend={(e: string, c: string) => {
                const r = async () => {
                    if(!e || !location)
                        return
                    const res = await isLoginAndLogin()
                    if(!res)
                        return
                    socket.emit("socket_send_message_to_user", {"body":e,"file":c,"to":location,"token":getToken()})
                }
                r()
            }} />
        </div>
    </>
}
export default MessagesChat