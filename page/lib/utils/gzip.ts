import { gzipSync, unzipSync } from "zlib"
import { Buffer } from "buffer"

export function gzip(data:string):string {
    const a = data
    const b = encodeURIComponent(a)
    const c = gzipSync(b)
    const d = c.toString("base64")
    const r = d.replaceAll("/","_").replaceAll("+","-")
    const s = r.replaceAll("H4sIAAAAAAAAA", "(")
        .replaceAll("AAAA", ")")
        .replaceAll("=", "")
    return s
}
export function unzip(data:string):string {
    const a = (data)
    .replaceAll("(", "H4sIAAAAAAAAA")
    .replaceAll(")", "AAAA")
    .replaceAll("-","+")
    .replaceAll("_","/")
    const b = Buffer.from(a, "base64")
    const c = unzipSync(b)
    const r = decodeURIComponent(c.toString("utf-8"))
    return r
}