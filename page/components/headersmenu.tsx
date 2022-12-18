import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { getToken, parseJwt } from "../lib/res/token"
import { get_user } from "../lib/res/user"
import { TypeUser, TypeUserExample } from "../lib/types/type"
import { IconBookmarks, IconLists, IconProfile, IconX } from "./components/icon"
import Header from "./headers"
import useClickAway from "./hook/useClickAway"
import styles from "./sass/header.module.scss"
import { UserIconMe } from "./usericon"
import { UserNameMini } from "./userinfo"
import { UserProfileInfoFollower } from "./userprofile"
const HeaderMenu = ({
    show,
    setShow
}:{
    show: boolean,
    setShow: Function
}) => {
    const ref = useRef<any>(null)
    const [user, setUser] = useState<TypeUser>(TypeUserExample())
    const [t,sT]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.name)},[])
    useClickAway(ref,() => {
        setShow(false)
    })
    useEffect(() => {
        const r = async () => {
            const res = await get_user(t)
            if(!res)
                return
            setUser(res)
        }
        r()
    },[t])
    return <>
        <div ref={ref} className={`${styles.HeaderMenu} ${show ? styles.active : ""}`}>
            <Header style={{padding: "16px 16px"}} useStyle={false} menu={false}>
                <div className={styles.header}>
                    <h1 style={{
                      fontSize: 17,
                      margin: 0,
                      color: "#222"
                    }}>Account info</h1>
                    <div className={styles.backButton} onClick={()=>setShow(false)}><IconX /></div>
                </div>
            </Header>
            <div className={styles._}>
                <div style={{padding: "0 16px"}}>
                    <UserIconMe width={42} height={42} />
                    <UserNameMini user={user} />
                    <UserProfileInfoFollower user={user} />
                </div>
                <div style={{margin: "16px 0"}}>
                    <Button link={`/@/${user.name}`} icon={<IconProfile />} text={"Profile"} />
                    <Button link={`/bookmarks`} icon={<IconBookmarks />} text={"Bookmarks"} />
                    <Button link={`/lists`} icon={<IconLists />} text={"Lists"} />
                </div>
            </div>
        </div>
        {show && <div className={styles.background} />}
    </>
}

const Button = ({
    link,
    icon,
    text
}:{
    link: string
    icon: any
    text: string
}) => <Link href={link}>
        <div className={styles.button}>
            <div className={styles.icon}>{icon}</div>
            <p>{text}</p>
        </div>
    </Link>
export default HeaderMenu