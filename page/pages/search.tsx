import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import stylesMenu from "../components/sass/userprofile.module.scss"
import { ComponentsBorderBottom } from '../components/components/components'
import TweetForm from '../components/tweetform'
import Main from './layout/main'
import Headers from '../components/headers'
import { useEffect, useState } from 'react'
import SearchBox from "../components/seatch"
import { useRouter } from 'next/router'
import { TypeTweet } from '../lib/types/type'
import { get, getUrl } from '../lib/utils/main'
import Tweets from '../components/tweets'

const Menu = ({
    onTop = () => {},
    onLatest = () => {},
    onPeople = () => {},
    onPhotos = () => {},
    onVideos = () => {}
}:{
    onTop?: Function,
    onLatest?: Function,
    onPeople?: Function,
    onPhotos?: Function,
    onVideos?: Function,
}) => {
    const [active, setActive] = useState("Top")
    const Button = ({
        onClick = () => {},
        text = ""
    }:{
        onClick?:Function,
        text?: string
    }) => {
        return <div onClick={(e: any)=>{
            setActive(text)
            onClick(e)
        }} className={stylesMenu.menu_button} style={{width: "20%"}}>
            <p className={text==active ? stylesMenu.active: ""}>{text}</p>
        </div>
    }
    return <div className={stylesMenu.menu}>
        <Button text={"Top"} onClick={() => onTop()}/>
        <Button text={"Latest"} onClick={() => onLatest()}/>
        <Button text={"People"} onClick={() => onPeople()}/>
        <Button text={"Photos"} onClick={() => onPhotos()}/>
        <Button text={"Videos"} onClick={() => onVideos()}/>
    </div>
}

export default function Search() {
    const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const router = useRouter()
    const { q } = router.query
    useEffect(() => {
        const r = async () => {
            const res = await get(getUrl(`/tweets?q=${q}`))
            if (!res || !res.data || !res.data.data)
                return
            setTweets(res.data.data)
        }
        r()
    },[q])
    useEffect(()=>{
        if(!router.asPath.includes("q="))
            router.replace("/explore")
    })
    return (
        <div>
          <Main>
            <>
                <Headers backLink child={
                    <div style={{borderBottom: "1px solid #eee"}}>
                        <Menu />
                    </div>
                }>
                    <div style={{width: "100%"}}>
                        <SearchBox />
                    </div>
                </Headers>
                <ComponentsBorderBottom>
                    <Tweets tweets={tweets} />
                </ComponentsBorderBottom>
            </>
          </Main>
        </div>
    )
}
