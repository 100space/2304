export interface BoardModel {
    email?: string
    username?: string
    subject?: string
}

export interface BoardRepository {
    getUserById: (email: string) => BoardModel
}

export interface BoardWriteDTO {
    email: string
    subject: string
    content: string
    hashtag: string
    category: string
    images: string
    thumbnail: string
    tel1?: string
    tel2?: string
    tel3?: string
}
