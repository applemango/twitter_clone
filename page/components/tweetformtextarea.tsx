import TextareaAutosize from 'react-textarea-autosize';
import styles from "./sass/tweetform.module.scss"
export const TweetFormTextarea = ({
    setActive = (t: boolean) => {},
    value,
    onChange,
    placeholder
}:{
    setActive?: Function
    value: string
    onChange: Function
    placeholder?: string
}) => {
    return <div>
        <TextareaAutosize onFocus={ () => {
            setActive(true)
        }} onChange={(e) => onChange(e.target.value)} value={value} placeholder={placeholder??"What's happening?"}className={styles.textarea} />
    </div>
}