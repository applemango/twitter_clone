import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { TypeTweet, TypeTweetExample, TypeUser } from '../../../lib/types/type'
import { ComponentsBorderBottom, LinkBack, TweetIconLeftBorder, TweetIconLeftBorderAll } from '../.././components/components/components'
import Headers from '../.././components/headers'
import Main from '../.././layout/main'
import UserProfile, { UserProfileMenu } from "../../components/userprofile"
import Tweets from "../../components/tweets"
import { get, getUrl } from "../../../lib/utils/main"
import { get_user } from "../../../lib/res/user"
import { TweetText } from "../../components/tweet"
import TweetContent from "../../components/tweetcontent"
import Tweetbig from "../../components/tweetbig"
import TweetBig from "../../components/tweetbig"
import { TweetBottomOneLine, TweetTopOneLine } from "../../components/tweetinfo"

export default function User() {
    const [replays, setReplays] = useState<Array<TypeTweet>>([])
    const [tweet, setTweet] = useState<TypeTweet>(TypeTweetExample())
    const [top, setTop] = useState<Array<TypeTweet>>([])
    const router = useRouter()
    const { name, id } = router.query
    useEffect(() => {
      const rrt = async (id: number) => {
        console.log("req", id)
        const res = await get(getUrl(`/tweets/${id}/if-replay-top`))
        if(!res.data.data)
          return
        setTop(res.data.data)
      }
      const rr = async (id: number) => {
        const res = await get(getUrl(`/replays/${id}`))
        if(!res.data.tweet)
          return
        setReplays(res.data.tweet)
      }
      const rt = async () => {
        if(!name || Array.isArray(name))
            return
        const res = await get(getUrl(`/tweets/${id}`))
        if(!res.data.data)
          return
        setTweet(res.data.data)
        await rrt(res.data.data.id)
        await rr(res.data.data.id)
      }
      rt()
    },[name, id])
    const Tc = ({
      n,
      children,
      icon
    }:{
      n: number
      children: any
      icon: string
    }) => {
      if (n==0)
        return <TweetIconLeftBorder name={icon}>{children}</TweetIconLeftBorder>
      return <TweetIconLeftBorderAll name={icon}>{children}</TweetIconLeftBorderAll>
    }
    return (
      <div>
        <Main children={
          <>
            <Headers backLink={true}>
              <h1 style={{
                fontSize: 18,
                margin: 0,
                color: "#222"
              }}>Tweet</h1>
            </Headers>
            {<ComponentsBorderBottom>
              <>
                { !!(top && top.length) && top.map((t: TypeTweet, i: number) => (
                  <LinkBack href={`/@/${t.user.name}/${t.id}`}>
                    <Tc n={i} icon={t.user.icon}>
                      <TweetTopOneLine tweet={t} />
                      <TweetText tweet={t} />
                      <TweetContent tweet={t} />
                      <TweetBottomOneLine tweet={t} />
                    </Tc>
                  </LinkBack>
                ))}
                <TweetBig setReplays={setReplays} tweet={tweet} />
              </>
              <Tweets filter={(t: TypeTweet) => true} tweets={replays} />
            </ComponentsBorderBottom>}
          </>
      } />
      </div>
    )
}
