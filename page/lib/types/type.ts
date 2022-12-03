export type TypeUser = {
    id: number
    name: string
    icon: string
    header: string
    admin: boolean
    following: number
    follower: number
    joined: string
}

export type TypeTweet = {
    id: number
    user_id: number
    user_icon: string
    user_name: string
    text: string
    content: string
    content_type: string
    timestamp: string
}

export type TypeMessage = {
    id: number
    to: TypeUser
    send: TypeUser
    body: string
    timestamp: string
    file: string
}