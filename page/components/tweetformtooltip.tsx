import { useRef, useState } from "react"
import { post_image } from "../lib/res/content"
import { IconGif, IconPhoto, IconPoll, IconVideo } from "./components/icon"
import styles from "./sass/tweetform.module.scss"
const TweetFormTooltip = ({
    onTweet = () => {},
    onPhoto = () => {},
    onTweetText
}:{
    onTweet?: Function
    onPhoto?: Function
    onTweetText?: string
}) => {
    const [selectedFile, setSelectedFile] = useState<File>()
    const ref = useRef<any>(null)
    return <div className={styles.tooltip}>
        <div style={{display: "flex"}}>
            <Button onClick={(e: any) => {
                ref.current.click()
            }} icon={<IconPhoto />} />
            <Button onClick={() => {}} icon={<IconGif />} />
            <Button onClick={() => {}} icon={<IconPoll />} />
        </div>
        <div>
            <Button2  text={onTweetText} onClick={onTweet} />
        </div>
        <input style={{display: "none"}} type="file" ref={ref} onChange={(e: any) => {
            e.preventDefault();
            if(!e.target.files[0])
                return
            setSelectedFile(e.target.files[0])
            const r = async () => {
                const res = await post_image(e.target.files[0])
                if(!res.path)
                    return
                onPhoto(res.path)
            }
            r()
        }} />
    </div>
}
const Button = ({
    icon,
    onClick = () => {}
}:{
    icon: any,
    onClick: Function
}) => {
    return <button onClick={() => onClick()} className={styles.button}>
        {icon}
    </button>
}

const Button2 = ({
    onClick = () => {},
    text
}:{
    onClick?: Function
    text?: string
}) => {
    return <div onClick={() => onClick()} className={styles.button2}>
        {text??"Tweet"}
    </div>
}
export default TweetFormTooltip