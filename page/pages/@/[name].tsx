import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { TypeTweet, TypeUser, TypeUserExample } from '../../lib/types/type'
import { ComponentsBorderBottom } from '.././components/components/components'
import Headers from '.././components/headers'
import Main from '.././layout/main'
import UserProfile, { UserProfileMenu } from "../components/userprofile"
import Tweets from "../components/tweets"
import { get, getUrl } from "../../lib/utils/main"
import { get_user } from "../../lib/res/user"

export default function User() {
    const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const [user, setUser] = useState<TypeUser>(TypeUserExample())
    const router = useRouter()
    const { name } = router.query
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
        setTweets(await req(`/tweets?username=${name}&start=${0}&end=${10}`))
      }
      r()
      const rs = async () => {
        if(!name || Array.isArray(name))
          return
        const res = await get_user(name)
        if(!res)
          return
        setUser(res)
      }
      rs()
    },[name])
    return (
      <div>
        <Main children={
          <>
            <Headers backLink={true}>
              <div>
                <h1 style={{
                  fontSize: 18,
                  margin: 0,
                  color: "#222"
                }}>{name}</h1>
                <p style={{
                  fontSize: 12,
                  margin: 0,
                  color: "#666"
                }}>{`${tweets.length} Tweets`}</p>
              </div>
            </Headers>
            {<ComponentsBorderBottom>
              <>
                <UserProfile user={user} />
                <UserProfileMenu onTweets={async () => {
                  setTweets(await req(`/tweets?username=${name}`))
                }} onMedia={async () => {
                  setTweets(await req(`/tweets?username=${name}&media=true`))
                }} onReply={async () => {
                  setTweets(await req(`/tweets?username=${name}&reply=true`))
                }} onLikes={async () => {
                  setTweets(await req(`/tweets?reply=true&like=true`))
                }} />
              </>
              <Tweets tweets={tweets} />
            </ComponentsBorderBottom>}
          </>
      } />
      </div>
    )
}
