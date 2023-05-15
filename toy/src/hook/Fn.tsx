export const useHandleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    navigator.clipboard
        .writeText(target.title)
        .then(() => {
            console.log("Text copied to clipboard...")
            alert(`"${target.title}"이 복사 되었습니다.`)
        })
        .catch((err) => {
            console.log("Something went wrong", err)
        })
}
export const KTime = (timeStampe: number) => {
    const date = new Date(timeStampe)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    const koreanTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return koreanTime
}
