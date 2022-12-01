export const floor = (n:number,p:number = 1) => {
    return Math.floor(n*(10**p))/(10**p)
}
export const dateConversion = (date:Date | number | string): string => {
    const time = Date.now()
    //const time = time_jst//-(1000*60*60*9) 
    //const time = time_jst
    const timestamp = typeof date == "number" ? date : new Date(date).getTime()
    const milliseconds = Math.abs(timestamp - time)
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const month = floor(days / 30)
    const year = floor(month / 12)
    if (year    >= 1) {return `${year   }y`/*years ago  `*/}
    if (month   >= 1) {return `${month  }m`/*months ago `*/}
    if (days    >= 1) {return `${days   }d`/*days ago   `*/}
    if (hours   >= 1) {return `${hours  }h`/*hours ago  `*/}
    if (minutes >= 1) {return `${minutes}min`/*minutes ago`*/}
    if (seconds >= 1) {return `${seconds}s`/*seconds ago`*/}
    return "1e308s"
}