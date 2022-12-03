import { Img } from "./components/components"
import styles from "./sass/usericon.module.scss"
const UserIcon = ({
    width = 32,
    height = 32,
    name = ""
}:{
    width?: number
    height?: number
    name?: string
}) => {
    const loader = () => {
        return
    }
    return <div>
        { !name ? <div style={{
            width: width,
            height: height
        }} className={styles.usericonnone} /> : <div style={{
            width: width,
            height: height
        }} className={styles.usericon}><Img name={name} /></div>}
    </div>
}
export default UserIcon