export interface CommentWriteDTO {
    writer: string
    boardid: number
    comment: string
}

// export interface CommentModel {
//     id: number
//     write: string
//     comment: string
//     boardid: number
// }
export interface CommentModel extends CommentWriteDTO {
    id: number
}
