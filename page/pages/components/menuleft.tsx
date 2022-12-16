import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getToken, parseJwt } from "../../lib/res/token"
import { Modals } from "./components/components"
import { IconBookmarks, IconBookmarksBold, IconExplore, IconExploreBold, IconHome, IconHomeBold, IconLists, IconListsBold, IconMessages, IconMessagesBold, IconMore, IconNotifications, IconNotificationsBold, IconProfile, IconProfileBold, IconTwitter } from "./components/icon"
import styles from "./sass/menuleft.module.scss"
import TweetForm from "./tweetform"
import UserIcon from "./usericon"
import { UserNameMini } from "./userinfo"
const MenuLeft = () => {
    const [showTweetForm, setShowTweetForm] = useState(false)

    const [t,sT]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.name)},[])
    return <div className={styles.main}>
        <div>
            <ButtonLink color_hover={"#1EA1F125"} active={false} link={"/"} icon={IconTwitter} />
            <ButtonLink link={"/"}                   iconActive={IconHomeBold} icon={IconHome} children="home" />
            <ButtonLink link={"/explore"}            iconActive={IconExploreBold} icon={IconExplore} children="Explore" />
            <ButtonLink link={"/notifications"} iconActive={IconNotificationsBold} icon={IconNotifications} children="Notifications" />
            <ButtonLink link={"/messages"}           iconActive={IconMessagesBold} icon={IconMessages} children="Messages" />
            <ButtonLink link={"/bookmarks"}     iconActive={IconBookmarksBold} icon={IconBookmarks} children="Bookmarks" />
            <ButtonLink link={"/lists"}         iconActive={IconListsBold} icon={IconLists} children="Lists" />
            <ButtonLink link={`/@/${t}`}       iconActive={IconProfileBold} icon={IconProfile} children="Profiles" />
            <Button icon={IconMore()}>
                <p style={{fontWeight: 400}}>More</p>
            </Button>
            <button onClick={()=> setShowTweetForm(true)} className={styles.button_tweet}>
                <p>Tweet</p>
            </button>
        </div>
        <User />
        <TweetFormModal show={showTweetForm} setShow={setShowTweetForm} />
    </div>
}

const TweetFormModal = ({
    show,
    setShow=()=>{}
}:{
    show?: boolean
    setShow?: Function
}) => {
    const [t,sT]=useState("")
    const [e,sE]=useState("")
    const [f,sF]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.name);sE(parseJwt(getToken(false))?.icon);sF(parseJwt(getToken(false))?.name_display)},[])
    return <Modals header={
        <div style={{display: "flex", justifyContent: "space-between", width: "100%", paddingRight: "8px", alignItems: "center"}}>
        </div>
        } isOpen={show} setOpen={setShow}>
            <div style={{margin: "0 24px", paddingBottom: "12px"}}>
                <TweetForm onTweets={() => setShow(false)} />
            </div>
        </Modals>
}

const User = () => {
    const [t,sT]=useState("")
    const [e,sE]=useState("")
    const [f,sF]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.name);sE(parseJwt(getToken(false))?.icon);sF(parseJwt(getToken(false))?.name_display)},[])
    return <div className={styles.button_user}>
        <Button icon={<UserIcon width={48} height={48} name={e} />}>
            <UserNameMini name={t} name_display={f} />
        </Button>
    </div>
}

type button = {
    color_hover?: string
    link?: string
    children?: any
    icon?: any
    iconActive?: any
    active?: boolean
}

const ButtonLink = ({
    color_hover,
    children,
    icon,
    iconActive,
    link,
    active,
}:button) => {
    const router = useRouter()
    const isActive = router.asPath == link && active != false
    return <Link href={link ?? "/"}>
        <Button color_hover={color_hover} icon={isActive ? iconActive() : icon()}>
            { children && <p style={{fontWeight: isActive ? 500 : 400}}>{children}</p>}
        </Button>
    </Link>
}

const Button = ({
    color_hover = "#eee",
    children,
    icon
}:button) => {
    return <div style={{backgroundColor: color_hover}} className={styles.button}>
        {children && children}
        {icon && <div className={styles.icon}>{icon}</div>}
    </div>
}
export default MenuLeft