import { useRouter } from "next/router"
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { TypeTweet } from '../../lib/types/type'
import styles from '../../styles/Home.module.css'
import { ComponentsBorderBottom } from '.././components/components/components'
import Headers from '.././components/headers'
import Timeline from '.././components/timeline'
import TweetForm from '.././components/tweetform'
import Main from '.././layout/main'

export default function User() {
    const [tweets, setTweets] = useState<Array<TypeTweet>>([])
    const router = useRouter()
    const { name } = router.query
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

            </ComponentsBorderBottom>}
          </>
      } />
      </div>
    )
}
