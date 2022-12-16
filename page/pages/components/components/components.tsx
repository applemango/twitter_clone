import { getLink, getRef, getUrl } from "../../../lib/utils/main"
import UserIcon from "../usericon"
import styles from "./sass/components.module.scss"
import Image from "next/image"
import { useEffect, useState } from "react"
import { TypeTweet } from "../../../lib/types/type"
import Link from "next/link"
import { useRouter } from "next/router"
import Modal from 'react-modal'
import { IconX } from "./icon"
import Headers from "../headers"
import TextareaAutosize from 'react-textarea-autosize';
Modal.setAppElement('#__next')

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

export const TweetIconLeftBorder = ({
    name,
    children,
    style,
    styleLeft,
    styleRight,
}:{
    name?: string
    children: any
    style?: any
    styleLeft?: any
    styleRight?: any
}) => {
    return <div className={styles.TweetIconBorderStart} style={Object.assign({display: "flex"}, style)}>
        <div className={styles.border} style={Object.assign({marginRight: 10}, styleLeft)}>
            <UserIcon name={name} width={42} height={42} />
        </div>
        <div style={Object.assign({
            width: "100%",
            height: "100%",
        },styleRight)}>
            {children}
        </div>
    </div>
}
export const TweetIconLeftBorderAll = ({
    name,
    children
}:{
    name?: string
    children: any
}) => <TweetIconLeftBorder name={name} children={children} styleLeft={{paddingTop: 16}} styleRight={{paddingTop: 16}}  />

export const TweetIconLeftBorderEnd = ({
    name,
    children
}:{
    name?: string
    children: any
}) => <TweetIconLeftBorder name={name} children={children} styleLeft={{paddingTop: 16, height: "fit-content"}} styleRight={{paddingTop: 16}}  />

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
    return <div className={styles.img}>
            <Image
                layout="fill"
                objectFit="contain"
                loader={()=>l}
                src={l}
                alt={name}
                style={{
                    objectFit: "cover"
                }}
            />
    </div>
}

export const ButtonFollow = ({
    onClick = () => {},
    following = false
}:{
    onClick?: Function
    following?: boolean
}) => {
    return <button className={`${styles.ButtonFollow} ${following && styles.following}`} onClick={(e: any) => onClick(e)}>
        <p>{following ? "Following" : "Follow"}</p>
    </button>
}

export const ImgAlt = ({
    title,
    subtitle,
    content
}:{
    title: string
    subtitle: string
    content: string
}) => {
    return <div className={styles.ImgAlt}>
        <Img name={content} />
        <div className={styles.alt}>
            <p>{subtitle}</p>
            <p>{title}</p>
        </div>
    </div>
}

export const Modals = ({
    children,
    header,
    isOpen = false,
    setOpen = () => {}
}:{
    children: any,
    header?: any,
    isOpen?: boolean,
    setOpen?: Function
}) => {
    const [open, setOpen_] = useState(false)
    useEffect(()=>{
        setOpen_(isOpen)
    },[isOpen])
    return <Modal
    className={styles.Modals}
    style={{
        overlay: {
            backgroundColor: "rgb(0 0 0 / 15%)",
            zIndex: 100
        },
        content: {}
    }}
    isOpen={open}
    onRequestClose={()=> {setOpen_(false);setOpen(false)}}
    >
        <Headers style={{padding: 0, borderRadius: "24px 24px 0 0"}}>
            <div className={styles.header} style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className={styles.close} onClick={()=> {setOpen_(false);setOpen(false)}}>
                    <IconX />
                </div>
                {header}
            </div>
        </Headers>
        <div>
            {children}
        </div>
    </Modal>
}

export const InputText = ({
    onChange=()=>{},
    value,
    placeholder
}:{
    onChange?: Function
    value?: string
    placeholder?: string
}) => {
    return <div className={styles.InputText}>
        <input value={value} onChange={(e) => onChange(e)} type="text" />
        <p>{placeholder}</p>
    </div>
}

export const InputTextArea = ({
    onChange=()=>{},
    value,
    placeholder
}:{
    onChange?: Function
    value?: string
    placeholder?: string
}) => {
    return <div className={styles.InputTextArea}>
        <TextareaAutosize className={`${styles.textarea} ${!value && styles.no}`} value={value} onChange={(e) => onChange(e)} />
        <p>{placeholder}</p>
    </div>
}