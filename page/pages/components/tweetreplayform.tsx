import { useEffect, useState } from "react"
import { getToken, parseJwt } from "../../lib/res/token"
import { post_replay, post_tweet } from "../../lib/res/tweet"
import { TypeTweet } from "../../lib/types/type"
import { TweetIconLeft } from "./components/components"
import TweetContent from "./tweetcontent"
import { TweetFormTextarea } from "./tweetformtextarea"
import TweetFormTooltip from "./tweetformtooltip"

const TweetReplayForm = ({
    setReplays,
    tweet
}:{
    setReplays: Function
    tweet: TypeTweet
}) => {
    const [active, setActive] = useState(false)
    const [text, setText] = useState("")
    const [content, setContent] = useState("")
    const [contentType, setContentType] = useState("")
    //hydration error
    const [t,sT]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.icon);console.log(parseJwt(getToken()))},[])
    return <div style={{
        width: "100%",
        height: "100%",
        paddingTop: 16
    }}>
        <TweetIconLeft name={t}>
            <div style={{display: active ? "" : "flex",justifyContent: active ? "" : "space-between"}}>
                <TweetFormTextarea placeholder="Tweet your replay" value={text} onChange={setText} setActive={setActive} />
                {!active && <button style={{
                    border: "none",
                    padding: "4px 14px",
                    borderRadius: 100,
                    fontWeight: 600,
                    color: "#fff",
                    backgroundColor: "#1EA1F180"
                }}>Replay</button>}
            </div>
            {content && <TweetContent content={content} contentType={contentType} />}
            {active && <TweetFormTooltip onTweetText={"Replay"} onTweet={() => {
                const r = async () => {
                    const res = await post_replay(tweet.id, text, content, contentType)
                    setReplays((value: any) => [res, ...value])
                }
                setText("")
                setContentType("")
                setContent("")
                r()
            }} onPhoto={(path: string) => {
                setContentType("image")
                setContent(path)
            }} />}
        </TweetIconLeft>
    </div>
}
export default TweetReplayForm