import { useEffect, useRef, useState } from "react"

const Header = ({
    children,
    useStyle = true,
    style = {}
}:{
    children: any,
    useStyle?: boolean,
    style?: any
}) => {
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
        position: "relative"
    }}>
        <div ref={ref} style={Object.assign({
            position: "fixed",
            backgroundColor: useStyle ? "#ffffff90" : "#fff",
            backdropFilter: useStyle ? "blur(12px)" : "",
            padding: useStyle ? "16px" : "",
            width: width,
        }, style)}>
        {children}
    </div>
    </div>
}
export {
    Header as default
}