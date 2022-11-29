import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ComponentsBorderBottom } from './components/components/components'
import Timeline from './components/timeline'
import TweetForm from './components/tweetform'
import Main from './layout/main'

export default function Home() {
  return (
    <div>
      <Main children={<ComponentsBorderBottom>
        <div style={{padding: 16}}>
          <h1 style={{
            fontSize: 20,
            marginTop: 0
          }}>Home</h1>
          <TweetForm />
        </div>
        <Timeline />
      </ComponentsBorderBottom>} />
    </div>
  )
}
