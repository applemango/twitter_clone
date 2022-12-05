import { TypeUser } from "../../lib/types/type"
import UserHeader from "./userheader"

import styles from "./sass/userprofile.module.scss"
import { ButtonFollow } from "./components/components"
import { useState } from "react"
const IconCalender = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-time" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#666" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><circle cx="18" cy="18" r="4" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" /></svg>

const UserProfile = ({
    user
}:{
    user: TypeUser
}) => {
    return <div>
        <UserHeader user={user}>
            <div className={styles.header_children}>
                <ButtonFollow onClick={(e: any) => console.log(e)} />
            </div>
        </UserHeader>
        <UserProfileInfo user={user} />
    </div>
}

const UserProfileInfo = ({
    user
}:{
    user: TypeUser
}) => {
    return <div className={styles.info}>
        <h2 className={styles.info_username}>{user.name}</h2>
        <p className={styles.info_account_name}>{`@${user.name}`}</p>
        <div className={styles.info_date}>
            <div><IconCalender/></div>
            <p>{`joined ${user.joined}`}</p>
        </div>
        <UserProfileInfoFollower user={user} />
        <p className={styles.info}>Not followed by anyone you're following</p>{/* what is thats */}
    </div>
}

const UserProfileInfoFollower = ({
    user
}:{
    user: TypeUser
}) => <div className={styles.follower}>
        <p><span>{user.following}</span>Following</p>
        <p><span>{user.follower}</span>Followers</p>
    </div>

const UserProfileMenu = ({
    onTweets = () => {},
    onReply = () => {},
    onMedia = () => {},
    onLikes = () => {}
}:{
    onTweets?: Function,
    onReply?: Function,
    onMedia?: Function,
    onLikes?: Function
}) => {
    const [active, setActive] = useState("Tweets")
    const Button = ({
        onClick = () => {},
        text = ""
    }:{
        onClick?:Function,
        text?: string
    }) => {
        return <div onClick={(e: any)=>{
            setActive(text)
            onClick(e)
        }} className={styles.menu_button}>
            <p className={text==active ? styles.active: ""}>{text}</p>
        </div>
    }
    return <div className={styles.menu}>
        <Button text={"Tweets"} onClick={() => onTweets()}/>
        <Button text={"Tweets & replies"} onClick={() => onReply()}/>
        <Button text={"Media"} onClick={() =>  onMedia()}/>
        <Button text={"Likes"} onClick={() =>  onLikes()}/>
    </div>
}

export {
    UserProfile as default,
    UserProfileInfo,
    UserProfileInfoFollower,
    UserProfileMenu,
}