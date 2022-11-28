import styles from "./usericon.module.scss"
const UserIcon = ({
    width = 32,
    hight = 32,
    url = ""
}:{
    width?: number
    hight?: number
    url?: string
}) => {
    const loader = () => {
        return
    }
    return <div>
        { url ? <div style={{
            width: width,
            hight: hight
        }} className={styles.usericonnone} /> : <div />}
    </div>
}
export default UserIcon