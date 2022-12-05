import { useEffect, useRef, useState } from "react"
import { BackLink } from "./components/components"
import { IconBack } from "./components/icon"
import HeaderMenu from "./headersmenu"
import useWindowSize from "./hook/useWindowSize"
import styles from "./sass/header.module.scss"
import { UserIconMe } from "./usericon"

const Header = ({
    children,
    useStyle = true,
    style = {},
    backLink = false,
    onBackClick = undefined,
    menu = false
}:{
    children: any
    useStyle?: boolean
    style?: any
    backLink?: boolean
    onBackClick?: Function | undefined
    menu?: boolean
}) => {
    const [w, h] = useWindowSize()
    const ref = useRef<any>(null)
    const refs = useRef<any>(null)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    useEffect(() => {
        setHeight(ref.current.offsetHeight)
        setWidth(refs.current.offsetWidth)
    })
    return <>
        <div ref={refs} style={{
            height: height ? height : "100%",
            width: "100%",
            position: "relative",
            zIndex: 20
        }}>
            <div ref={ref} style={Object.assign({
                position: "fixed",
                backgroundColor: useStyle ? "#ffffff90" : "#fff",
                backdropFilter: useStyle ? "blur(12px)" : "",
                padding: useStyle ? 8 : "",
                width: width,
            }, style)}>
                <div style={{
                    display: backLink || onBackClick || menu ?"flex" : "",
                    alignItems: backLink || onBackClick || menu ? "center" : "",
                }}>
                    {menu && <MenuButton onClick={()=>setShowMenu(true)} />}
                    {backLink && <BackButton />}
                    {onBackClick && <div onClick={() => onBackClick()} className={styles.backButton}><IconBack /></div>}
                    {children}
                </div>
            </div>
        </div>
        {menu && <HeaderMenu show={showMenu} setShow={setShowMenu} />}
    </>
}

const BackButton = () => <BackLink>
        <div className={styles.backButton}>
            <IconBack />
        </div>
    </BackLink>

const MenuButton = ({onClick=()=>{}}:{onClick?:Function}) => <div onClick={() => onClick()} className={`${styles.backButton} ${styles.menuButton}`}>
        <UserIconMe width={38} height={38} />
    </div>

export {
    Header as default,
    BackButton
}