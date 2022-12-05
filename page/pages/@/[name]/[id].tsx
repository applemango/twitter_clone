import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { TypeTweet, TypeTweetExample, TypeUser } from '../../../lib/types/type'
import { ComponentsBorderBottom } from '../.././components/components/components'
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

export default function User() {
    const [replays, setReplays] = useState<Array<TypeTweet>>([])
    const [tweet, setTweet] = useState<TypeTweet>(TypeTweetExample())
    const router = useRouter()
    const { name, id } = router.query
    useEffect(() => {
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
        rr(res.data.data.id)
      }
      rt()
    },[name, id])
    console.log(replays)
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
                    <TweetBig setReplays={setReplays} tweet={tweet} />
                </>
                <Tweets tweets={replays} />
            </ComponentsBorderBottom>}
          </>
      } />
      </div>
    )
}
