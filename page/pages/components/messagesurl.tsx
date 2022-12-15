import { useEffect, useState } from "react"
import { get_messages_user } from "../../lib/res/messages"
import { TypeUser } from "../../lib/types/type"
import { get, getUrl } from "../../lib/utils/main"
import { Modals, TweetIconLeft } from "./components/components"
import { IconAddUser, IconSettings } from "./components/icon"
import Header from "./headers"
import styles from "./sass/messages.module.scss"
import { InfoTopOneLine } from "./tweetinfo"
import UserIcon from "./usericon"
import Usericon from "./usericon"
import { UserNameTowLine } from "./userinfo"

const MessagesUser = ({
    onChange
}:{
    onChange: Function
}) => {
    const [searchUsers, setSearchUsers] = useState<Array<TypeUser>>([])
    const [searchUsersQuery, setSearchUsersQuery] = useState<String>("")
    useEffect(()=>{
        const r = async () => {
            const res = await get(getUrl("/users/all"))
            if(!res||!res.data)
                return
            setSearchUsers(res.data.data)
        }
        r()
    },[searchUsersQuery])

    const [users, setUsers] = useState<Array<TypeUser>>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    useEffect(() => {
        const r = async () => {
            const res = await get_messages_user()
            if(!res)
                return
            setUsers(res)
        }
        r()
    },[])
    return <>
    <Modals header={
        <h1 style={{
            fontSize: 18,
            margin: 8,
            color: "#222"
        }}>New message</h1>
    } isOpen={isOpen} setOpen={setIsOpen}>
        <div style={{borderTop: "1px solid #eee"}}>
        { (searchUsers && !!searchUsers.length) && searchUsers.map((user: TypeUser, i:number) => (
            <div onClick={()=>{
                onChange(user.id)
                setIsOpen(false)
            }} className={styles.searchUser} style={{padding: "8px 16px",cursor: "pointer"}}>
                <UserNameTowLine follow={false} iconSize={42} user={user} />
            </div>
        ))}
        </div>
    </Modals>
    <div className={styles.users}>
        <Header menu={true}>
            <div className={styles.header}>
                <h1 style={{
                  fontSize: 18,
                  margin: 8,
                  color: "#222"
                }}>Messages</h1>
                <div style={{display: "flex"}}>
                    <div className={styles.add}><IconSettings /></div>
                    <div className={styles.add} onClick={()=> setIsOpen(true)}><IconAddUser /></div>
                </div>
            </div>
        </Header>
        <div>
            { (users && !!users.length) && users.map((user: TypeUser, i:number) => (
                <User onClick={(e: number) => onChange(e)} user={user} />
            ))}
        </div>
    </div>
    </>
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
            <InfoTopOneLine name_display={user.name_display} name={user.name} timestamp={""} />
        </TweetIconLeft>
    </div>
}
export default MessagesUser