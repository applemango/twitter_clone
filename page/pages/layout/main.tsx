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
    return <div className={styles.main}>
        <div style={{width: 200}}>
            <MenuLeft />
        </div>
        <div className={styles._}>
            <div className={styles.center}>
                {children}
            </div>
            { right !== false ?
                right ?? <div style={{width: 600}}><MenuRight /></div> : null
            }
        </div>
    </div>
}
export default Main