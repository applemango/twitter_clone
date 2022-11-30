import { useRef, useState } from "react"
import { post_image } from "../../lib/res/content"
import styles from "./sass/tweetform.module.scss"
const IconPhoto = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="15" y1="8" x2="15.01" y2="8" /><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" /><path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" /></svg>
const IconVideo = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-device-tv" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="3" y="7" width="18" height="13" rx="2" /><polyline points="16 3 12 7 8 3" /></svg>
const IconVideo2 = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-movie" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="8" y1="4" x2="8" y2="20" /><line x1="16" y1="4" x2="16" y2="20" /><line x1="4" y1="8" x2="8" y2="8" /><line x1="4" y1="16" x2="8" y2="16" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="16" y1="8" x2="20" y2="8" /><line x1="16" y1="16" x2="20" y2="16" /></svg>
const IconVideo3 = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-video" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" /><rect x="3" y="6" width="12" height="12" rx="2" /></svg>
const IconPoll = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-list-details" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 5h8" /><path d="M13 9h5" /><path d="M13 15h8" /><path d="M13 19h5" /><rect x="3" y="4" width="6" height="6" rx="1" /><rect x="3" y="14" width="6" height="6" rx="1" /></svg>
const TweetFormTooltip = ({
    onTweet = () => {},
    onPhoto = () => {}
}:{
    onTweet?: Function
    onPhoto?: Function
}) => {
    const [selectedFile, setSelectedFile] = useState<File>()
    const ref = useRef<any>(null)
    return <div className={styles.tooltip}>
        <div style={{display: "flex"}}>
            <Button onClick={(e: any) => {
                ref.current.click()
            }} icon={<IconPhoto />} />
            <Button onClick={() => {}} icon={<IconVideo3 />} />
            <Button onClick={() => {}} icon={<IconPoll />} />
        </div>
        <div>
            <Button2 onClick={onTweet} />
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
    onClick = () => {}
}:{
    onClick?: Function
}) => {
    return <div onClick={() => onClick()} className={styles.button2}>
        Tweet
    </div>
}
export default TweetFormTooltip