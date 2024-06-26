export interface Comments {
    id: string;
    mainId: string;
    comment: string;
    postedTime: string;
    userName: string;
    userSid: string;
    likes: number;
    isResolved: boolean;
}