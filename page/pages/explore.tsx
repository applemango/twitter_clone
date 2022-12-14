import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ComponentsBorderBottom, Img, ImgAlt } from './components/components/components'
import TweetForm from './components/tweetform'
import Main from './layout/main'
import Headers from './components/headers'
import Search from './components/seatch'
import stylesMenu from "./components/sass/userprofile.module.scss"
import { useEffect, useState } from 'react'
import { get, getUrl } from '../lib/utils/main'
import { Tags } from './components/menurightcomponent'

const Menu = ({

}:{

}) => {
  const [active, setActive] = useState("For you")
  const Button = ({
      onClick = () => {},
      text = "",
      width = "20%"
  }:{
      onClick?:Function,
      text?: string
      width?: string
  }) => {
      return <div onClick={(e: any)=>{
          setActive(text)
          onClick(e)
      }} className={stylesMenu.menu_button} style={{width: width}}>
          <p className={text==active ? stylesMenu.active: ""}>{text}</p>
      </div>
  }
  return <div className={stylesMenu.menu} style={{width: 560}}>
      <Button width={"80px"} text={"For you"}/>
      <Button width={"80px"} text={"Trending"}/>
      <Button width={"120px"} text={"World Cup"}/>
      <Button width={"60px"} text={"News"}/>
      <Button width={"80px"} text={"Sports"}/>
      <Button width={"140px"} text={"Entertainment"}/>
  </div>
}

export default function Home() {
  const [tags, setTags] = useState<any>()
  const [i,setI] = useState("")
  useEffect(()=>setI("header.jpg"))
  useEffect(()=>{
      const r = async () => {
          const res = await get(getUrl("/explore/trend"))
          if (!res || !res.data || !res.data.data)
              return
          setTags(res.data.data)
      }
      r()
  },[])
  return (
    <div>
      <Main children={<ComponentsBorderBottom>
            <Headers backLink child={
                <div>
                    <Menu />
                </div>
            }>
                <div style={{width: "100%"}}>
                    <Search />
                </div>
            </Headers>
            <ImgAlt subtitle={"Hello, world!"} title={"Hello, world! and Example text"} content={i}  />
            <Tags tags={tags} />
      </ComponentsBorderBottom>} />
    </div>
  )
}
