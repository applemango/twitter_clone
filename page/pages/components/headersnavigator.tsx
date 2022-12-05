import Link from "next/link"
import { useRouter } from "next/router"
import { IconHome, IconHomeBold, IconMessages, IconMessagesBold, IconNotifications, IconNotificationsBold, IconSearch, IconSearchBold } from "./components/icon"
import styles from "./sass/header.module.scss"
// header?...
const HeaderNavigator = () => {
    const Button = ({
        link,
        icon,
        iconActive
    }:{
        link: string
        icon: any
        iconActive: any
    }) => {
        const router = useRouter()
        const isActive = router.asPath == link
        return <Link href={link}>
            <div className={styles.button}>
                {isActive ? iconActive : icon}
            </div>
        </Link>
    }
    return <div className={styles.HeaderNavigator}>
        <Button link={"/"} icon={<IconHome />}   iconActive={<IconHomeBold />} />
        <Button link={"/explore"} icon={<IconSearch />} iconActive={<IconSearchBold />} />
        <Button link={"/notifications"} icon={<IconNotifications />} iconActive={<IconNotificationsBold />} />
        <Button link={"/messages"} icon={<IconMessages />} iconActive={<IconMessagesBold />} />
    </div>
}
export default HeaderNavigator