import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ComponentsBorderBottom } from './components/components/components'
import TweetForm from './components/tweetform'
import Main from './layout/main'
import io from 'socket.io-client';
import { getToken } from '../lib/res/token'
import MessagesUser from './components/messagesurl'
import Messages from './components/messages'
import MessagesChat from './components/messageschat'

const socket = io("ws://127.0.0.1:5000", {
    query : {
        token: getToken()
    }
})

export default function Home() {
  const [location, setLocation] = useState(-1)
  return (
    <div>
      <Main right={false} children={<div style={{display: "flex"}}>
        <MessagesUser onChange={(e: number) => setLocation(e)} />
        <MessagesChat socket={socket} location={location} />
      </div>} />
    </div>
  )
}
