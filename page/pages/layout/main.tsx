import { useRouter } from "next/router"
import { useEffect } from "react"
import { getToken } from "../../lib/res/token"
import MenuLeft from "../components/menuleft"
import MenuRight from "../components/menuright"
import styles from "./sass/main.module.scss"
const Main = ({
    children,
    right,
}: {
    children: any // TODO: i forget what the React component type is.
    right? : any | null | boolean // ,,
}) => {
    const router= useRouter()
    const isLogin = !!getToken(true)
    useEffect(() => {
        if(!isLogin) {
            router.replace("/login")
        }
    })
    return <div className={styles.main}>
        <div style={{width: 200}}>
            <MenuLeft />
        </div>
        <div className={styles._}>
            { right !== false ?
                right ?? <div style={{width: 350}}><MenuRight /></div> : null
            }
            <div style={{}} className={styles.center}>
                {children}
            </div>
        </div>
    </div>
}
export default Main