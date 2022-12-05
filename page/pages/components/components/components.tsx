import { getLink, getRef, getUrl } from "../../../lib/utils/main"
import UserIcon from "../usericon"
import styles from "./sass/components.module.scss"
import Image from "next/image"
import { useEffect } from "react"
import { TypeTweet } from "../../../lib/types/type"
import Link from "next/link"
import { useRouter } from "next/router"

export const LinkBack = ({
    children,
    href
}:{
    children: any,
    href: string
}) => {
    const router = useRouter()
    return <Link href={getLink(href, router.asPath)}>{children}</Link>
}
export const BackLink = ({
    children
}:{
    children: any
}) => {
    const router = useRouter()
    const { ref } = router.query
    return <Link href={Array.isArray(ref) ? "/" : getRef(ref)}>{children}</Link>
}

export const TweetIconLeft = ({
    name,
    children
}:{
    name?: string
    children: any
}) => {
    return <div style={{display: "flex"}}>
        <div style={{marginRight: 10}}>
            <UserIcon name={name} width={42} height={42} />
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
    children,
    end = false
}:{
    children: Array<any> | any,
    end?: boolean
}) => {
    return <div>
        { children && children.length ? children.map((item: any, i: number) => (
            <>
                <div key={i} style={{
                    borderBottom: children.length - 1 > i || end ? "1px solid #eee" : ""
                }}>
                    {item}
                </div>
            </>
        )) : children && <div style={{
            borderBottom: end ? "1px solid #eee": ""
        }}>{children}</div>}
    </div>
}

export const Img = ({
    name
}:{
    name: string
}) => {
    const l = getUrl(`/tweets/image/${name}`)
    const loader = () => l
    return <div className={styles.img}>
            <Image
                layout="fill"
                objectFit="contain"
                loader={loader}
                src={l}
                alt={name}
                style={{
                    objectFit: "cover"
                }}
            />
    </div>
}

export const ButtonFollow = ({
    onClick = () => {}
}:{
    onClick?: Function
}) => {
    return <button className={styles.ButtonFollow} onClick={(e: any) => onClick(e)}>
        <p>Follow</p>
    </button>
}