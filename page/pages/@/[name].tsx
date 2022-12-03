import { useRouter } from "next/router"
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { TypeTweet, TypeUser } from '../../lib/types/type'
import styles from '../../styles/Home.module.css'
import { ComponentsBorderBottom } from '.././components/components/components'
import Headers from '.././components/headers'
import Timeline from '.././components/timeline'
import TweetForm from '.././components/tweetform'
import Main from '.././layout/main'
import UserProfile, { UserProfileMenu } from "../components/userprofile"
import Tweets from "../components/tweets"
import { get, getUrl } from "../../lib/utils/main"
import { get_user } from "../../lib/res/user"

export default function User() {
    const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const [user, setUser] = useState<TypeUser>({
      id: -1,
      name: "Undefined",
      icon: "",
      header: "",
      admin: false,
      follower: -1,
      following: -1,
      joined: "September 2000"
    })
    const router = useRouter()
    const { name } = router.query
    /*const user:TypeUser = {
      id: 0,
      name: "apple",
      icon: "icon.jpg",
      header: "header.jpg",
      admin: false,
      follower: 1200,
      following: 100,
      joined: "September 2000"
    }*/
    const req = async (url: string) => {
      try {
        const res = await get(getUrl(url))
        return res.data.data
      } catch (e) {}
    }
    useEffect(() => {
      const r = async () => {
        if(!name || Array.isArray(name))
          return
        setTweets(await req(`/tweets/${name}?start=${0}&end=${10}`))
      }
      r()
      const rs = async () => {
        if(!name || Array.isArray(name))
          return
        const res = await get_user(name)
        if(!res)
          return
        console.log(res)
        setUser(res)
      }
      rs()
    },[name])
    return (
      <div>
        <Main children={
          <>
            <Headers>
              <h1 style={{
                fontSize: 20,
                margin: 0,
                color: "#222"
              }}>Home</h1>
            </Headers>
            {<ComponentsBorderBottom>
              <>
                <UserProfile user={user} />
                <UserProfileMenu />
              </>
              <Tweets tweets={tweets} />
            </ComponentsBorderBottom>}
          </>
      } />
      </div>
    )
}
