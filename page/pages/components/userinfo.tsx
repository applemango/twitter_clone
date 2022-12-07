import { TypeUser, TypeUserExample } from "../../lib/types/type"
import { ButtonFollow, LinkBack } from "./components/components"
import styles from "./sass/userinfo.module.scss"
import UserIcon from "./usericon"
import { UserProfileInfoFollower } from "./userprofile"

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

export const UserNameHover = ({
    user = TypeUserExample(),
    children
}:{
    user?:TypeUser,
    children?: any 
}) => {
    return <div className={styles.UserNameHover}>
        <LinkBack href={`/@/${user.name}`}>
            <div className={styles.children}>
                {children}
            </div>
            <div className={styles.hover}>
                <div className={styles._}>
                    <UserIcon name={user.icon} width={56} height={56} />
                    <div><ButtonFollow onClick={(e: any) => {e.preventDefault();}} /></div>
                </div>
                <UserNameMini user={user} />
                <UserProfileInfoFollower user={user} />
            </div>
        </LinkBack>
    </div>
}