import Link from "next/link"
import { useRouter } from "next/router"
import styles from "./sass/menuleft.module.scss"
const IconMore =         (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-dots-circle-horizontal" width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="9" /><line x1="8" y1="12" x2="8" y2="12.01" /><line x1="12" y1="12" x2="12" y2="12.01" /><line x1="16" y1="12" x2="16" y2="12.01" /></svg>
const IconProfile =      (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user"                   width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg>
const IconList =         (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-notes"                  width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="5" y="3" width="14" height="18" rx="2" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /><line x1="9" y1="15" x2="13" y2="15" /></svg>
const IconBookmark =     (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bookmark"               width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2" /></svg>
const IconMessages =     (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail"                   width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>
const IconNotification = (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bell"                   width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" /><path d="M9 17v1a3 3 0 0 0 6 0v-1" /></svg>
const IconExplore =      (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-hash"                   width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="15" x2="19" y2="15" /><line x1="11" y1="4" x2="7" y2="20" /><line x1="17" y1="4" x2="13" y2="20" /></svg>
const IconHome =         (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-cards"           width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="4" y="4" width="6" height="16" rx="2" /><rect x="14" y="4" width="6" height="10" rx="2" /></svg>
const Icon =             (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-meat"                   width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#333" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13.62 8.382l1.966 -1.967a2 2 0 1 1 3.414 -1.415a2 2 0 1 1 -1.413 3.414l-1.82 1.821" /><ellipse transform="rotate(45 8.025 16.475)" cx="8.025" cy="16.475" rx="7" ry="3" /><path d="M7.5 16l1 1" /><path d="M12.975 21.425c3.905 -3.906 4.855 -9.288 2.121 -12.021c-2.733 -2.734 -8.115 -1.784 -12.02 2.121" /></svg>
const Icon2 =            (strokeWidth: number = 1.5) => <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-twitter"          width="38" height="38" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="#00abfb" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z" /></svg>
const MenuLeft = () => {
    return <div className={styles.main}>
        <div>
            <ButtonLink color_hover={"#00abfb25"} active={false} link={"/"} icon={Icon2} />
            <ButtonLink link={"/"} icon={IconHome} children="home" />
            <ButtonLink link={"/explore"} icon={IconExplore} children="Explore" />
            {/*<ButtonLink link={"/notifications"} icon={IconNotification()} children="Notifications" />*/}
            <ButtonLink link={"/messages"} icon={IconMessages} children="Messages" />
            {/*<ButtonLink link={"/bookmarks"} icon={IconBookmark()} children="Bookmarks" />*/}            
            {/*<ButtonLink link={"/lists"} icon={IconList()} children="Lists" />*/}
            <ButtonLink link={"/@/apple"} icon={IconProfile} children="Profiles" />
            <Button icon={IconMore(1.5)}>
                <p style={{fontWeight: 400}}>More</p>
            </Button>
        </div>
        <div></div>
    </div>
}

type button = {
    color_hover?: string
    link?: string
    children?: any
    icon?: any
    active?: boolean
}

const ButtonLink = ({
    color_hover,
    children,
    icon,
    link,
    active
}:button) => {
    const router = useRouter()
    const isActive = router.asPath == link && active != false
    return <Link href={link ?? "/"}>
        <Button color_hover={color_hover} icon={icon ? icon(isActive ? 2 : 1.5) : ""}>
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