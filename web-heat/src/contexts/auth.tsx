import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
    id: string,
    name: string,
    login: string,
    avatar_url: string,
}

type AuthContextData = {
    user: User | null,
    signInUrl: string,
    signOut: () => void
}

export const authContext = createContext({} as AuthContextData)

type AuthProvider = {
    children: ReactNode
}


type AuthResponse = {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        name: string,
        login: string,
    }
}

export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null)
    
    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=1e41e7ae6b94f00c0b70`

    async function signIn(gitHubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: gitHubCode
        })

        const { token, user } = response.data

        localStorage.setItem('@dowhile:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}`

        setUser(user)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if(token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`
            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')
        
        if(hasGithubCode) {
            const [urlWhioutCode, gitHubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWhioutCode)

            signIn(gitHubCode)
        }


    }, [])


    return(
        <authContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </authContext.Provider>
    )
}