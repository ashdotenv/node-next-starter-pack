import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { userLogedIn } from "../auth/authSlice"
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BASE_URL,
        credentials: 'include' as const
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => ({
                url: "auth/refresh",
                method: "GET"
            })
        }),
        loadUser: builder.query({
            query: () => ({
                url: "me",
                method: "GET"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled
                    dispatch(
                        userLogedIn(
                            { accessToken: result.data.accesstoken, user: result.data.user }
                        )
                    )
                } catch (error: any) {
                    console.error(error)
                }
            }
        })
    })
})
export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice