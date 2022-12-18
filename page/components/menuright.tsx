import Headers from "./headers"
import { WhatsHappening, WhoToFollow } from "./menurightcomponent"
import styles from "./sass/menuright.module.scss"
import Search from "./seatch"
const MenuRight = () => {
    return <div>
        <Headers useStyle={false}>
            <Search />
        </Headers>
        <WhatsHappening />
        <WhoToFollow />
    </div>
}

export default MenuRight