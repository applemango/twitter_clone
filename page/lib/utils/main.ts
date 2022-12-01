import axios from "axios";
import { getToken, isLoginAndLogin, logout } from "../res/token"

export function getUrl (url: string, useToken: boolean = false): string {
    if(process.browser) {
        const and = url.indexOf("?") + 1 ? "&jwt=" : "?jwt="
        if(useToken) {
            const token = getToken()
            if(!token) {
                return ""
            }
            const host = location.host.split(':')[0];
            return `${location.protocol}//${host}:5000/${url}${useToken ? and + token : ""}`
        }
        const host = location.host.split(':')[0];
        return `${location.protocol}//${host}:5000/${url}`
    }
    return ""
}

export async function get(url: string,login: boolean = true, header: any = {}) {
    if(login) {
        const res = await isLoginAndLogin()
        if(!res) {
            throw "token not found"
        }
    }
    try {
        let head = header
        if(login) {
            head["Authorization"] = "Bearer "+getToken()
        }
        const res = await axios.get(
            url, {
                headers: head
            }
        )
        console.log(res)
        return res
    } catch (e:any) {
        if (e.response.status == 401) {
            const res = await logout()
        }
        console.error(e)
        throw e
    }
}

export async function post(url: string, body: any = {}, login: boolean = true, header: any = {}) {
    if(login) {
        const res = await isLoginAndLogin()
        if(!res) {
            throw "token not found"
        }
    }
    try {
        let head = header
        if(login) {
            head["Authorization"] = "Bearer "+getToken()
        }
        const res = await axios.post(
            url, {
                body: JSON.stringify(body)
            }, {
                headers: head
            }
        )
        console.log(res)
        return res
    } catch (e:any) {
        if (e.response.status == 401) {
            const res = await logout()
        }
        console.error(e)
        throw e
    }
}