import { useEffect, useRef, useState } from "react"
import { post_image } from "../../lib/res/content"
import { TypeUser } from "../../lib/types/type"
import { Img } from "./components/components"
import { IconUpload, IconX } from "./components/icon"
import styles from "./sass/userprofile.module.scss"
import UserIcon from "./usericon"
const UserHeader = ({
    user,
    children,
    edit = false,
    onChangeIcon = () => {},
    onChangeHeader = () => {}
}:{
    user: TypeUser
    children?: any
    edit?: boolean
    onChangeIcon?: Function
    onChangeHeader?: Function
}) => {
    const [icon, setIcon] = useState(user.icon)
    const [header, setHeader] = useState(user.header)
    const ref_header = useRef<any>(null)
    const ref_icon = useRef<any>(null)
    useEffect(() => {
        setIcon(user.icon) 
        setHeader(user.header)
    },[user])
    return <div className={`${styles.header} ${edit && styles.edit}`}>
        <div className={styles.header_image}>
            {header && <Img name={header} />}
            {edit && <div className={styles.header_image_edit}>
                    <div>
                        <div onClick={() => ref_header.current.click()} className={styles.upload_icon}><IconUpload /></div>
                        <div onClick={() => {onChangeHeader("");setHeader("")}} className={styles.upload_icon}><IconX /></div>
                    </div>
                    <input style={{display: "none"}} type="file" ref={ref_header} onChange={async (e: any) => {
                        e.preventDefault();
                        if(!e.target.files[0])
                            return
                        const res = await post_image(e.target.files[0])
                        if(!res.path)
                            return
                        onChangeHeader(res.path)
                        setHeader(res.path)
                    }} />
                </div>}
        </div>
        <div className={styles.header_bottom}>
            <div className={styles.header_icon}>
                <UserIcon name={icon} width={138} height={138} />
                { edit && <div className={styles.header_icon_edit}>
                        <div onClick={() => ref_icon.current.click()} className={styles.upload_icon}><IconUpload /></div>
                        <input style={{display: "none"}} type="file" ref={ref_icon} onChange={async (e: any) => {
                            e.preventDefault();
                            if(!e.target.files[0])
                                return
                            const res = await post_image(e.target.files[0])
                            if(!res.path)
                                return
                            onChangeIcon(res.path)
                            setIcon(res.path)
                        }} />
                    </div>}
            </div>
            <div className={styles.header_children}>
                {children}
            </div>
        </div>
    </div>
}
export default UserHeader