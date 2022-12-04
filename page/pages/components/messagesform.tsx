import { useRef, useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import { post_image } from "../../lib/res/content";
import styles from "./sass/messages.module.scss";
import { TweetContentImage } from "./tweetcontent";
const IconSend = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1EA1F1" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="10" y1="14" x2="21" y2="3" /><path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" /></svg>
const IconPhoto = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="#1EA1F1" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="15" y1="8" x2="15.01" y2="8" /><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" /><path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" /></svg>
const MessagesForm = ({
    onSend
}:{
    onSend: Function
}) => {
    const [text, setText] = useState("")
    const [content, setContent] = useState("")
    const [selectedFile, setSelectedFile] = useState<File>()
    const ref = useRef<any>(null)
    return <div style={{borderTop: "1px solid #eee"}}>
        <div className={styles.form}>
            {content && <TweetContentImage content={content} />}
            <div className={styles._}>
                <Button onClick={() => {
                    ref.current.click()
                }} icon={IconPhoto()} />
                <TextareaAutosize value={text} onChange={(e: any) => setText(e.target.value)} placeholder="Start a new message" className={styles.textarea} />
                <Button onClick={() => {
                    onSend(text, content)
                    setText("")
                    setContent("")
                }} icon={IconSend()} />
                <input style={{display: "none"}} type="file" ref={ref} onChange={(e: any) => {
                    e.preventDefault();
                    if(!e.target.files[0])
                        return
                    setSelectedFile(e.target.files[0])
                    const r = async () => {
                        const res = await post_image(e.target.files[0])
                        if(!res.path)
                            return
                        setContent(res.path)
                    }
                    r()
                }} />
            </div>
        </div>
    </div>
}

const Button = ({
    icon,
    onClick = () => {}
}:{
    icon: any
    onClick?: Function
}) => {
    return <div onClick={() => onClick()} className={styles.button}>
        {icon}
    </div>
}
export default MessagesForm