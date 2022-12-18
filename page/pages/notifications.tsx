import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ComponentsBorderBottom } from '../components/components/components'
import TweetForm from '../components/tweetform'
import Main from './layout/main'

export default function Home() {
  return (
    <div>
      <Main>
        <ComponentsBorderBottom>
        </ComponentsBorderBottom>
      </Main>
    </div>
  )
}
