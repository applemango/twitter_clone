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
    const [u, setUrl] = useState("/tweets?username={name}")
    const { name } = router.query
    const url = (link: string, n?: number) => {
      return link.replace("{name}", String(name))
              .replace("{now}", String(n || now))
              .replace("{limit}", String(5))
              .concat(`&p=${n || now}&limit=${5}`)
    }
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
                  setTweets(await req(url("/tweets?username={name}",1)/*`/tweets?username=${name}`*/))
                  setUrl("/tweets?username={name}")
                  setHasMore(true)
                  setNow(1)
                }} onMedia={async () => {
                  setTweets(await req(url("/tweets?username={name}&media=true",1)/*`/tweets?username=${name}&media=true`*/))
                  setUrl("/tweets?username={name}&media=true")
                  setHasMore(true)
                  setNow(1)
                }} onReply={async () => {
                  setTweets(await req(url("/tweets?username={name}&reply=true",1)/*`/tweets?username=${name}&reply=true`*/))
                  setUrl("/tweets?username={name}&reply=true")
                  setHasMore(true)
                  setNow(1)
                }} onLikes={async () => {
                  setTweets(await req(url("/tweets?reply=true&like=true",1)/*`/tweets?reply=true&like=true`*/))
                  setUrl("/tweets?reply=true&like=true")
                  setHasMore(true)
                  setNow(1)
                }} />
              </>
              <Tweets pageStart={2} hasMore={hasMore} loadMore={async () => {
                if(!name)
                  return
                console.log(url(u, now), now)
                const res = await get(getUrl(url(u, now)/*`/tweets?username=${name}&p=${now}&limit=${5}`*/))
                if(!res || !res.data || !res.data.data)
                    return
                if(res.data.data.length < 5)
                    setHasMore(false)
                setNow(nows => nows + 1)
                setTweets((tweets: any) => [...tweets, ...res.data.data])
              }} tweets={tweets} />
            </ComponentsBorderBottom>}
          </>
        </Main>
      </div>
    )
}
