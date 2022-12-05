import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { TypeTweet } from '../lib/types/type'
import styles from '../styles/Home.module.css'
import { ComponentsBorderBottom } from './components/components/components'
import Headers from './components/headers'
import Timeline from './components/timeline'
import TweetForm from './components/tweetform'
import Main from './layout/main'

export default function Home() {
  const [tweets, setTweets] = useState<Array<TypeTweet>>([])
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
            <div style={{padding: 16}}>
              <TweetForm setTweets={setTweets} />
            </div>
            <Timeline tweets={tweets} setTweets={setTweets} />
          </ComponentsBorderBottom>}
        </>
      } />
    </div>
  )
}
