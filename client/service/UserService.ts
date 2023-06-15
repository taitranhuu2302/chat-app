import { API } from "@/constants/Api"
import { useQuery } from "react-query"
import axiosConfig from '@/config/AxiosConfig'
import queryString from "query-string"

export const useGetUserApi = ({options, query}: any) => {
    return useQuery([API.USER.INDEX, query], (): Promise<ResponseSuccess<UserType[]>> => axiosConfig.get(`${API.USER.INDEX}?${queryString.stringify(query)}`), options)
}