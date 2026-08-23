import {createSlice,PayloadAction} from '@reduxjs/toolkit'

import { AppDispatch } from './store'
import { Status } from '../types/status'
import { API, APIAuthenticated } from '../http'


interface LoginData{
    email : string,
    password : string
}

interface User{
    username : string | null,
    email : string | null,
    role : string | null,
    id : string | null
}

interface AuthState{
    user : User,
    status : Status,
    token : string | null,
    error : string | null
}

const initialState:AuthState = {
    user : {} as User,
    status : Status.LOADING,
    token : localStorage.getItem('token'),
    error : null
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        setUser(state:AuthState,action:PayloadAction<User>){
            state.user = action.payload
        },
        setStatus(state:AuthState,action:PayloadAction<Status>){
            state.status = action.payload
        },
        resetStatus(state:AuthState){
            state.status = Status.LOADING
        },
        setToken(state:AuthState,action:PayloadAction<string>){
            state.token = action.payload
        },
        setError(state:AuthState,action:PayloadAction<string | null>){
            state.error = action.payload
        },
        setUserLogout(state:AuthState){
            state.token = null
            state.user = {
                email : null,
                username : null,
                role : null,
                id : null
            }
        }
    }
})

 export const {setUser,setStatus,resetStatus,setToken,setUserLogout,setError} = authSlice.actions
 export default authSlice.reducer



export function login(data:LoginData){
    return async function loginThunk(dispatch:AppDispatch){
        dispatch(setStatus(Status.LOADING))
        dispatch(setError(null))
        try {
            const response = await API.post('login',data)
            if(response.status === 200){
                const {data:token} = response.data
                localStorage.setItem('token',token)
                dispatch(setToken(token))

                // Fetch the profile so we know the user's role before
                // granting access to the (admin-only) dashboard.
                const profileResponse = await APIAuthenticated.get('profile')
                const profile = profileResponse.data.data
                if(profile.role !== 'admin'){
                    localStorage.removeItem('token')
                    dispatch(setUserLogout())
                    dispatch(setError('Only admin users can access this dashboard'))
                    dispatch(setStatus(Status.ERROR))
                    return { success: false as const, message: 'Only admin users can access this dashboard' }
                }
                dispatch(setUser({
                    username : profile.username,
                    email : profile.email,
                    role : profile.role,
                    id : profile.id
                }))
                localStorage.setItem('user',JSON.stringify(profile))
                dispatch(setStatus(Status.SUCCESS))
                return { success: true as const }
            }
            dispatch(setStatus(Status.ERROR))
            return { success: false as const, message: 'Login failed' }
        } catch (error:any) {
            const message = error?.response?.data?.message ?? 'Login failed'
            dispatch(setError(message))
            dispatch(setStatus(Status.ERROR))
            return { success: false as const, message }
        }
    }
}

export function fetchProfile(){
    return async function fetchProfileThunk(dispatch:AppDispatch){
        try {
            const response = await APIAuthenticated.get('profile')
            if(response.status === 200){
                const profile = response.data.data
                if(profile.role !== 'admin'){
                    localStorage.clear()
                    dispatch(setUserLogout())
                    return
                }
                dispatch(setUser({
                    username : profile.username,
                    email : profile.email,
                    role : profile.role,
                    id : profile.id
                }))
                dispatch(setStatus(Status.SUCCESS))
            }
        } catch (error) {
            localStorage.clear()
            dispatch(setUserLogout())
        }
    }
}
