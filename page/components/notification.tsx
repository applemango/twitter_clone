import { useEffect, useState } from "react"
import { io } from "socket.io-client";
import { getToken } from "../lib/res/token";
import { TypeMessage } from "../lib/types/type";
import { getUrl } from "../lib/utils/main";

const socket = io("ws://192.168.1.2:6500", {
    query : {
        token: getToken()
    }
})
const Notification_ = () => {
    const [AllNotifications, setAllNotifications] = useState<Array<any>>([""])

    const NewNotifications = (option: any, title: string, link: string) => {
        if ("Notification" in window) {
            const permission = Notification.permission;
            if (permission != "granted") {
                return
            }
            let desktopNotification = new Notification(title, option)
            desktopNotification.onclick = () => {
                window.open(link)
            }
        }
    }

    useEffect(() => {
        if (!Notification)
            return
        if ("Notification" in window) {
            const permission = Notification.permission;
            if (permission == "denied" || permission == "granted") {
                return
            }
            Notification.requestPermission(() => {
                const option = {
                    body: "Example Notification",
                    icon: getUrl("/tweets/image/icon.png")
                }
                let desktopNotification = new Notification("Hi!", option)
                desktopNotification.onclick = () => {
                    window.open(window.location.origin)
                }
            })
        }
    },[])
    useEffect(() => {
        socket.off("message_from_user")
        socket.on("message_from_user", (msg: TypeMessage) => {
            if(AllNotifications[AllNotifications.length - 1] == msg.id)
                return
            setAllNotifications((all) => [...all, msg.id])
            NewNotifications(
                {
                    body: msg.body,
                    icon: getUrl(`/tweets/image/${msg.send.icon}`)
                },
                `Message from ${msg.send.name}`,
                window.location.origin + "/messages"
            )
        })
        socket.off("tweet_notification")
        socket.on("tweet_notification", (msg: any) => {
            console.log(msg)
            if(AllNotifications[AllNotifications.length - 1] == msg.id)
                return
            setAllNotifications((all) => [...all, msg.id])
            NewNotifications(
                {
                    body: msg.body,
                    icon: getUrl(`/tweets/image/${msg.icon}`)
                },
                `${msg.from} Tweeted`,
                `${window.location.origin}/@/${msg.from}/${msg.id}`
            )
        })
    },[])
    return <div></div>
}
export default Notification_