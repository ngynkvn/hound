import axios, { AxiosResponse } from "axios"

const api_path = "http://localhost:6080/api/v1";

export const get = <T>(path: string): Promise<AxiosResponse<T>> => {
    return axios.get(`${api_path}/${path}`)
}
type Repo = Record<string, {
    'url': string,
    'ms-between-poll': string,
    'vcs': string,
    'enable-poll-updates': boolean
}>;
type APIResponse<T> = Promise<AxiosResponse<T>>
export const fetchRepos = (): APIResponse<Repo> => {
    return get('repos');
}