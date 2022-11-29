import { useRouter } from "next/router"
import { useState } from "react"
import { login } from "../lib/res/token"

const Login = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    return <div>
        <input value={username} onChange={(e: any) => setUsername(e.target.value)} type="text" placeholder="username" /><br />
        <input value={password} onChange={(e: any) => setPassword(e.target.value)} type="text" placeholder="password" /><br />
        <button style={{marginRight: 10}} onClick={() => {
            const t = async () => {
                const res = await login(username, password)
                if(!(res.msg == "success")) return
                router.replace("/")
            }
            t()
        }}>login</button>
        <button>register</button>
    </div>
}
export default Login