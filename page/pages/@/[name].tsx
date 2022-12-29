import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { TypeTweet, TypeUser, TypeUserExample } from '../../lib/types/type'
import { ComponentsBorderBottom } from '../../components/components/components'
import Headers from '../../components/headers'
import Main from '.././layout/main'
import UserProfile, { UserProfileMenu } from "../../components/userprofile"
import Tweets from "../../components/tweets"
import { get, getUrl } from "../../lib/utils/main"
import { get_user } from "../../lib/res/user"
import { getToken, parseJwt } from "../../lib/res/token"

export default function User() {
    const [me, setMe] = useState(false)
    const [t,sT]=useState("")
    useEffect(()=>{sT(parseJwt(getToken(true))?.name)},[])
    const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const [user, setUser] = useState<TypeUser>(TypeUserExample())
    const router = useRouter()
    const [hasMore, setHasMore] = useState(true)
    const [now, setNow] = useState(1)
    const { name } = router.query
    const req = async (url: string) => {
      try {
        const res = await get(getUrl(url))
        return res.data.data
      } catch (e) {}
    }
    useEffect(() => {
      /*const r = async () => {
        if(!name || Array.isArray(name))
          return
        setTweets(await req(`/tweets?username=${name}?limit=${5}`))
      }
      r()*/
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
    useEffect(()=>{
      if(user.name == t)
        setMe(true)
    },[user, t])
    return (
      <div>
        <Main>
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
                }}>{`${tweets ? tweets.length : 0} Tweets`}</p>
              </div>
            </Headers>
            {<ComponentsBorderBottom>
              <>
                <UserProfile me={me} user={user} />
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
              <Tweets hasMore={hasMore} loadMore={async () => {
                const res = await get(getUrl(`/tweets?username=${name}&p=${now}&limit=${5}`))
                if(!res || !res.data || !res.data.data)
                    return
                if(res.data.data.length < 5)
                    setHasMore(false)
                setNow(now => now + 1)
                setTweets((tweets: any) => [...tweets, ...res.data.data])
              }} tweets={tweets} />
            </ComponentsBorderBottom>}
          </>
        </Main>
      </div>
    )
}
