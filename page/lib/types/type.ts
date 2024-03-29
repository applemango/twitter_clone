export type TypeToken = {
    fresh: boolean
    iat: number
    jti: string
    type: "access" | "refresh"
    sub: number
    nbf: number
    exp: number
    name: string
    name_display: string
    icon: string
}
export const TypeTokenExample = ():TypeToken => {
    return {
        fresh: false,
        iat: 1670058923,
        jti: "07af15eb-e02f-47de-98c5-c0b41fd42714",
        type: "access",
        sub: -1,
        nbf: 1670058923,
        exp: 1672650923,
        name: "undefined",
        name_display: "none",
        icon: "icon.jpg"
    }
}

export type TypeUser = {
    id: number
    name: string
    name_display: string
    icon: string
    header: string
    admin: boolean
    follow: boolean
    following: number
    follower: number
    joined: string
    profile: string
    location: string
    website: string
}
export const TypeUserExample = ():TypeUser => {
    return {
        id: -1,
        name: "undefined",
        name_display: "none",
        follow: false,
        icon: "",
        header: "",
        admin: false,
        follower: 1200,
        following: 100,
        joined: "September 2000",
        profile: "Hello, world!",
        location: "japan",
        website: "http://localhost:3000"
    }
}

export type TypeTweet = {
    id: number
    user: TypeUser
    user_id: number
    user_icon: string
    user_name: string
    text: string
    content: string
    content_type: "image" | "retweet" | ""
    timestamp: string
    likes: number
    retweets: number
    quoteTweets: number
    replays: number
    replay: Array<TypeTweet>
    retweet: TypeTweet | null
    liked: boolean
    replayed: boolean
    retweeted: boolean
}
export const TypeTweetExample = ():TypeTweet => {
    return {
        id: -1,
        user: TypeUserExample(),
        user_id: -1,
        user_icon: "",
        user_name: "undefined",
        text: "undefined",
        content: "",
        content_type: "",
        timestamp: "1670058923",
        likes: -1,
        retweets: -1,
        quoteTweets: -1,
        replays: -1,
        replay: [],
        retweet: null,
        liked: true,
        replayed: false,
        retweeted: false,
    }
}

export type TypeMessage = {
    id: number
    to: TypeUser
    send: TypeUser
    body: string
    timestamp: string
    file: string
}
