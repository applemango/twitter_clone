import { TypeUser } from "../../lib/types/type"
import { Img } from "./components/components"
import styles from "./sass/userprofile.module.scss"
import UserIcon from "./usericon"
const UserHeader = ({
    user,
    children
}:{
    user: TypeUser
    children?: any
}) => {
    return <div className={styles.header}>
        <div className={styles.header_image}>
            {user.header && <Img name={user.header} />}
        </div>
        <div className={styles.header_bottom}>
            <div className={styles.header_icon}>
                <UserIcon name={user.icon} width={138} height={138} />
            </div>
            <div className={styles.header_children}>
                {children}
            </div>
        </div>
    </div>
}
export default UserHeader