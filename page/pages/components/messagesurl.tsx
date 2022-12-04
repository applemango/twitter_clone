import { useEffect, useState } from "react"
import { get_messages_user } from "../../lib/res/messages"
import { TypeUser } from "../../lib/types/type"
import { TweetIconLeft } from "./components/components"
import Header from "./headers"
import styles from "./sass/messages.module.scss"
import { InfoTopOneLine } from "./tweetinfo"

const MessagesUser = ({
    onChange
}:{
    onChange: Function
}) => {
    const [users, setUsers] = useState<Array<TypeUser>>([])
    useEffect(() => {
        const r = async () => {
            const res = await get_messages_user()
            if(!res)
                return
            setUsers(res)
        }
        r()
    },[])
    return <div className={styles.users}>
        <Header>
            <h1 style={{
              fontSize: 20,
              margin: 0,
              color: "#222"
            }}>Messages</h1>
        </Header>
        <div>
            { (users && !!users.length) && users.map((user: TypeUser, i:number) => (
                <User onClick={(e: number) => onChange(e)} user={user} />
            ))}
        </div>
    </div>
}

const User = ({
    user,
    onClick = () => {}
}:{
    user: TypeUser
    onClick: Function
}) => {
    return <div onClick={() => onClick(user.id)} className={styles.user}>
        <TweetIconLeft name={user.icon}>
            <InfoTopOneLine name={user.name} timestamp={""} />
        </TweetIconLeft>
    </div>
}
export default MessagesUser