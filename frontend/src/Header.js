import './Header.css'
import { Link } from 'react-router-dom'
import Login from './Login'
import { useModal, useSetModal } from './hooks'


function Header() {
    const modal = useModal()
    const setModal = useSetModal()
    const handleClickLogin = () => {
        setModal(<Login />)
        modal(true)
    }
    return(
        <header className="header">
            <span onClick={handleClickLogin} className='loginButton'>Login</span>
            <Link to="/"><h1>Inquilino perfecto</h1></Link>
            <Link to="/register">Registro</Link>
            <Link to="/user/edit-profile">Editar perfil</Link>
        </header>
    )
}

export default Header






