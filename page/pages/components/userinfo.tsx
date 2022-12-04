import { TypeUser } from "../../lib/types/type"
import styles from "./sass/userinfo.module.scss"

export const UserNameMini = ({
    user
}:{
    user: TypeUser
}) => {
    return <div className={styles.UserNameMini}>
        <p className={styles.username}>{user.name}</p>
        <p className={styles.accountname}>{`@${user.name}`}</p>
    </div>
}