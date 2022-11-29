import styles from "./sass/usericon.module.scss"
const UserIcon = ({
    width = 32,
    height = 32,
    url = ""
}:{
    width?: number
    height?: number
    url?: string
}) => {
    const loader = () => {
        return
    }
    return <div>
        { !url ? <div style={{
            width: width,
            height: height
        }} className={styles.usericonnone} /> : <div />}
    </div>
}
export default UserIcon