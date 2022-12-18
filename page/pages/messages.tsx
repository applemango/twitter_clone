import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ComponentsBorderBottom } from '../components/components/components'
import TweetForm from '../components/tweetform'
import Main from './layout/main'
import io from 'socket.io-client';
import { getToken } from '../lib/res/token'
import MessagesUser from '../components/messagesurl'
import Messages from '../components/messages'
import MessagesChat from '../components/messageschat'
import styles from "../components/sass/messages.module.scss"

const socket = io("ws://192.168.1.2:6500", {
    query : {
        token: getToken()
    }
})

export default function Home() {
  const [location, setLocation] = useState(-1)
  return (
    <div>
      <Main marginBottom={false} navigator={location == -1} right={false}>
        <>
          <div className={`${styles.main} ${location!=-1 ? styles.active : ""}`} style={{display: "flex"}}>
            <MessagesUser onChange={(e: number) => setLocation(e)} />
            <MessagesChat setLocation={setLocation} socket={socket} location={location} />
          </div>
        </>
      </Main>
    </div>
  )
}
