export interface apiKey {
    apiKey: string
}

export interface Countries {
    code: string,
    name: string,
    flag: string    
}

export interface News {
    save?: string,
    country: string,
    sourceName: string,
    author: string,
    title: string,
    description: string,
    url: string,
    imageUrl: string,
    datetime: Date,
    content: string,
    timestamp: number

}