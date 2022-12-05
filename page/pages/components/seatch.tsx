import { IconSearch } from "./components/icon"
import styles from "./sass/search.module.scss"
const Search = () => {
    return <div className={styles.main}>
        <div className={styles._}>
            <div className={styles.icon}>
                <IconSearch />
            </div>
            <input placeholder="Search Twitter" className={styles.input} type="text" />
        </div>
    </div>
}
export default Search