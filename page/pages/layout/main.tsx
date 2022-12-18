import { useRouter } from "next/router"
import { useEffect } from "react"
import { getToken } from "../../lib/res/token"
import HeaderNavigator from "../../components/headersnavigator"
import MenuLeft from "../../components/menuleft"
import MenuRight from "../../components/menuright"
import styles from "./sass/main.module.scss"
import Notification_ from "../../components/notification"
const Main = ({
    children,
    right,
    navigator = true,
    marginBottom = true
}: {
    children: any // TODO: i forget what the React component type is.
    right? : any | null | boolean // ,,
    navigator?: boolean
    marginBottom?: boolean
}) => {
    const router= useRouter()
    const isLogin = !!getToken(true)
    useEffect(() => {
        if(!isLogin) {
            router.replace("/login")
        }
    })
    return <>
        <div className={`${styles.main} ${!marginBottom ? styles.notMarginBottom : ""}`}>
            <div className={styles.left}>
                <MenuLeft />
            </div>
            <div className={styles._}>
                { right !== false ?
                    right ?? <div className={styles.right}><MenuRight /></div> : null
                }
                <div style={{}} className={styles.center}>
                    {children}
                </div>
            </div>
        </div>
        {navigator && <div><HeaderNavigator /></div>}
        <Notification_ />
    </>
}
export default Main