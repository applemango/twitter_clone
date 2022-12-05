import { useEffect, useRef, useState } from "react"
import { BackLink } from "./components/components"
import { IconBack } from "./components/icon"
import useWindowSize from "./hook/useWindowSize"
import styles from "./sass/header.module.scss"

const Header = ({
    children,
    useStyle = true,
    style = {},
    backLink = false,
    onBackClick = undefined
}:{
    children: any
    useStyle?: boolean
    style?: any
    backLink?: boolean
    onBackClick?: Function | undefined
}) => {
    const [w, h] = useWindowSize()
    const ref = useRef<any>(null)
    const refs = useRef<any>(null)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        setHeight(ref.current.offsetHeight)
        setWidth(refs.current.offsetWidth)
    })
    return <div ref={refs} style={{
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
            display: backLink || onBackClick ?"flex" : "",
            alignItems: backLink || onBackClick ? "center" : "",
        }}>
            {backLink && <BackButton />}
            {onBackClick && <div onClick={() => onBackClick()} className={styles.backButton}><IconBack /></div>}
            {children}
        </div>
    </div>
    </div>
}

const BackButton = () => <BackLink>
        <div className={styles.backButton}>
            <IconBack />
        </div>
    </BackLink>

export {
    Header as default,
    BackButton
}