import { WhatsHappening, WhoToFollow } from "./menurightcomponent"
import styles from "./sass/menuright.module.scss"
import Search from "./seatch"
const MenuRight = () => {
    return <div>
        <Search />
        <WhatsHappening />
        <WhoToFollow />
    </div>
}

export default MenuRight