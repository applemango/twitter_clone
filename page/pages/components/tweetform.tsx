import { useEffect, useState } from "react"
import { TweetIconLeft } from "./components/components"
import { TweetFormTextarea } from "./tweetformtextarea"
import TweetFormTooltip from "./tweetformtooltip"
import styles from "./sass/tweetform.module.scss"
import { post_tweet } from "../../lib/res/tweet"
import TweetContent from "./tweetcontent"
import { getToken, parseJwt } from "../../lib/res/token"

const IconPlanet = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-planet" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805" /><circle cx="12" cy="12" r="7" /></svg>
const IconDown = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="6 9 12 15 18 9" /></svg>

const TweetForm = ({
    setTweets
}:{
    setTweets: Function
}) => {
    const [active, setActive] = useState(false)
    const [text, setText] = useState("")
    const [content, setContent] = useState("")
    const [contentType, setContentType] = useState("")

    //hydration error
    const [t,sT]=useState("")
    useEffect(()=>sT(parseJwt(getToken(true))?.icon),[])

    return <div style={{
        width: "100%",
        height: "100%"
    }}>
        <TweetIconLeft name={t}>
            {active && <ActiveTo />}
            <TweetFormTextarea value={text} onChange={setText} setActive={setActive} />
            {content && <TweetContent content={content} contentType={contentType} />}
            {active && <ActiveCanReply />}
            <TweetFormTooltip onTweet={() => {
                const r = async () => {
                    const res = await post_tweet(text, content, contentType)
                    setTweets((value: any) => [res, ...value])
                }
                setText("")
                setContentType("")
                setContent("")
                r()
            }} onPhoto={(path: string) => {
                setContentType("image")
                setContent(path)
            }} />
        </TweetIconLeft>
    </div>
}

const ActiveTo = () => {
    return <div className={styles.activeTo}>
        <p>Everyone</p>
        <div><IconDown /></div>
    </div>
}

const ActiveCanReply = () => {
    return <div className={styles.activeCanReplay} style={{borderBottom: "1px solid #eee", marginBottom: 16}}>
        <div>
            <div><IconPlanet /></div>
            <p>Everyone can replay</p>
        </div>
    </div>
}
export default TweetForm