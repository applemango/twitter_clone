import Link from "next/link"
import { useEffect, useState } from "react"
import { TypeUser } from "../../lib/types/type"
import { get, getUrl } from "../../lib/utils/main"
import { ButtonFollow } from "./components/components"
import styles from "./sass/menuright.module.scss"
import UserIcon from "./usericon"
import Usericon from "./usericon"
import { UserNameMini, UserNameTowLine } from "./userinfo"

const quickSortTag = (array: Array<[string, number]>) => {
    type arr = Array<[string, number]>
    const quickSort = (arr: arr, low :number, high: number) => {
        if (low < high) {
            let pivot = partition(arr, low, high);
            quickSort(arr, low, pivot - 1);
            quickSort(arr, pivot + 1, high);
        }
    }
    const partition = (arr: arr, low :number, high :number) => {
        let pivot = arr[high][1];
        let i = low -1;
        for (let j = low; j < high; j++) {
            if (arr[j][1] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i + 1, high);
        return i + 1;
    }
    const swap = (arr: arr, i:number, j:number) => {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    quickSort(array, 0, array.length - 1)
    return array
}

const Button = ({
    link,
    children
}:{
    link: string
    children: any
}) => {
    return <Link href={link}>
        <div className={styles.button}>
            {children}
        </div>
    </Link>
}

const Trend = ({
    name,
    tweets
}:{
    name: string
    tweets: number
}) => {
    return <div className={styles.trend}>
        <p className={styles.location}>Trending in System</p>
        <p className={styles.name}>{name}</p>
        <p className={styles.tweets}>{`${tweets} Tweets`}</p>
    </div>
}

export const WhatsHappening = () => {
    const [tags, setTags] = useState<any>()
    useEffect(()=>{
        const r = async () => {
            const res = await get(getUrl("/explore/trend"))
            if (!res || !res.data || !res.data.data)
                return
            setTags(res.data.data)
        }
        r()
    },[])
    console.log(tags)
    return <div className={styles.components}>
        <p className={styles.title}>What't happening</p>
        {!!(tags && tags.length) && quickSortTag(tags).reverse().map((tag: [string, number], i:number)=>(
            <Button link={"/"}>
                <Trend name={tag[0]} tweets={tag[1]} />
            </Button>
        ))}
        <Button link={"/"}>
            <p className={styles.more}>Show more</p>
        </Button>
    </div>
}

export const WhoToFollow = () => {
    const [u, setU] = useState<TypeUser>()
    useEffect(() => {
        const r = async () => {
            const res = await get(getUrl("/user/apple"))
            if (!res || !res.data || !res.data.data)
                return
            setU(res.data.data)
        }
        r()
    },[])
    return <div className={styles.components}>
        <p className={styles.title}>Who to follow</p>
        <Button link={"/@/apple"}>
            <UserNameTowLine user={u} />
        </Button>
        <Button link={"/"}>
            <p className={styles.more}>Show more</p>
        </Button>
    </div>
}