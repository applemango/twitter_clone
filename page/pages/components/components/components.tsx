import UserIcon from "../usericon"
import styles from "./sass/components.module.scss"

export const TweetIconLeft = ({
    children
}:{
    children: any
}) => {
    return <div style={{display: "flex"}}>
        <div style={{marginRight: 10}}>
            <UserIcon width={38} height={38} />
        </div>
        <div style={{
            width: "100%",
            height: "100%",
        }}>
            {children}
        </div>
    </div>
}

export const ComponentsBorderBottom = ({
    children
}:{
    children: Array<any> | any
}) => {
    return <div>
        { children && children.length ? children.map((item: any, i: number) => (
            <>
                <div key={i} style={{
                    borderBottom: children.length - 1 > i ? "1px solid #eee" : ""
                }}>
                    {item}
                </div>
            </>
        )) : children && <div style={{
            //borderBottom: "1px solid #eee"
        }}>{children}</div>}
    </div>
}


