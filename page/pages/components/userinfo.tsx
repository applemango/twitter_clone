import { TypeUser, TypeUserExample } from "../../lib/types/type"
import styles from "./sass/userinfo.module.scss"

export const UserNameMini = ({
    user = TypeUserExample(),
    name,    
}:{
    user?: TypeUser
    name?: string
}) => {
    return <div className={styles.UserNameMini}>
        <p className={styles.username}>{name ?? user.name}</p>
        <p className={styles.accountname}>{`@${name ?? user.name}`}</p>
    </div>
}