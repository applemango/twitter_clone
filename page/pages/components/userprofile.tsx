import { TypeUser } from "../../lib/types/type"
import UserHeader from "./userheader"

import styles from "./sass/userprofile.module.scss"
import componentsStyles from "./components/sass/components.module.scss"
import { ButtonFollow, InputText, InputTextArea, Modals } from "./components/components"
import { useEffect, useState } from "react"
import { getUrl, post } from "../../lib/utils/main"
import { useRouter } from "next/router"
const IconCalender = () => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-calendar-time" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="#666" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.795 21h-6.795a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v4" /><circle cx="18" cy="18" r="4" /><path d="M15 3v4" /><path d="M7 3v4" /><path d="M3 11h16" /><path d="M18 16.496v1.504l1 1" /></svg>

const ButtonEditProfile = ({
    onClick = () => {}
}:{
    onClick?: Function
}) => {
    return <button onClick={()=> onClick()} className={styles.ButtonEditProfile}>
        <p>Edit profile</p>
    </button>
}

const UserProfile = ({
    user,
    me = false
}:{
    user: TypeUser,
    me?: boolean
}) => {
    const [showEditProfile, setShowEditProfile] = useState(false)
    return <div>
        <UserProfileModal user={user} show={showEditProfile} setShow={setShowEditProfile} me={me}/>
        <UserHeader user={user}>
            <div className={styles.header_children}>
                {me ? <ButtonEditProfile onClick={()=> setShowEditProfile(true)} /> : <ButtonFollow onClick={(e: any) => console.log(e)} />}
            </div>
        </UserHeader>
        <UserProfileInfo user={user} />
    </div>
}

const UserProfileModal = ({
    user,
    show,
    setShow,
    me = false
}:{
    user: TypeUser
    show: boolean,
    setShow: Function,
    me: boolean
}) => {
    const [name, setName] = useState(user.name_display)
    const [bio, setBio] = useState(user.profile)
    const [location, setLocation] = useState(user.location)
    const [website, setWebsite] = useState(user.website)
    const [icon, setIcon] = useState(user.icon)
    const [header, setHeader] = useState(user.header)
    const router = useRouter()
    useEffect(()=>{
        setName(user.name_display)
        setBio(user.profile)
        setLocation(user.location)
        setWebsite(user.website)
        setIcon(user.icon)
        setHeader(user.header)
    },[user])
    return <Modals header={
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", paddingRight: "8px", alignItems: "center"}}>
            <h1 style={{
                fontSize: 18,
                margin: 8,
                color: "#222"
            }}>Edit profile</h1>
            <div>
                <button onClick={async () => {
                    const res = await post(
                        getUrl("/users/update"),
                        {
                            "name": name,
                            "bio": bio,
                            "location": location,
                            "website": website,
                            "icon": icon,
                            "header": header
                        }
                    )
                    router.reload()
                }} className={componentsStyles.ButtonFollow}>
                    <p>save</p>
                </button>
            </div>
        </div>
        } isOpen={show} setOpen={setShow}>
            <div style={{margin: "0 3px"}}>
                <UserHeader onChangeIcon={(e: string)=> setIcon(e)} onChangeHeader={(e: string)=> setHeader(e)}edit={me} user={user}>
                    <div className={styles.header_children}></div>
                </UserHeader>
            </div>
            <div style={{margin: "0 24px", paddingBottom: "12px"}}>
                <InputText value={name} onChange={(e: any)=> setName(e.target.value)} placeholder="Name"/>
                <InputTextArea value={bio} onChange={(e: any)=> setBio(e.target.value)} placeholder="Bio" />
                <InputText value={location} onChange={(e: any)=> setLocation(e.target.value)} placeholder="location"/>
                <InputText value={website} onChange={(e: any)=> setWebsite(e.target.value)} placeholder="website"/>
            </div>
        </Modals>
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