"use client"
import { apiSlice } from "../api/apiSlice"
import { userLogedIn, userRegistration } from "./authSlice"

interface registrationResponse {
    message: string
    activationToken: string
}
interface registrationData {

}
const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "auth/register-user",
                method: "POST",
                body: data
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled
                    dispatch(
                        userRegistration(
                            { token: result.data.activationToken }
                        )
                    )
                } catch (error) {

                }
            }
        }),
        activation: builder.mutation({
            query: ({ activation_token, activation_code }) => ({
                url: "auth/activate-user",
                body: { activation_token, activation_code },
                method: "POST"
            })
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "auth/login-user",
                method: "POST",
                body: body
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled
                    dispatch(
                        userLogedIn(
                            { accessToken: result.data.accessToken, user: result.data.user }
                        )
                    )
                } catch (error) {

                }
            }
        })

    })
})

export const { useRegisterMutation, useActivationMutation, useLoginMutation } = authApi