import styles from "./styles.module.scss"
import { VscGithubInverted, } from "react-icons/vsc"
import { useContext } from "react"
import { authContext } from "../../contexts/auth"

export function LoginBox(){

    const { signInUrl } = useContext(authContext)

    return (
        <div className={styles.LoginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
               <VscGithubInverted size = "24"/> 
               Entrar com Github
            </a>
        </div>
    )
}