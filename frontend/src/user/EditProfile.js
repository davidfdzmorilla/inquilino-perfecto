import './EditProfile.css'
import { Suspense, useState } from 'react'
import { useSetUser, useUser } from '../hooks'
import useFetch from "../useFetch"
import Loading from '../Loading'
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL


function EditProfile() {

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [emailConfirm, setEmailConfirm] = useState('')
    const [password, setPassword] = useState('')
    const [passConfirm, setPassConfirm] = useState('')
    const [bio, setBio] = useState('')
    const [picName, setPicName] = useState('No se ha cargado foto')

    const user = useUser()
    const setUser = useSetUser()

    const userData = useFetch(REACT_APP_BASE_URL + '/users/profile', {
        headers: {
            'Authorization': 'Bearer ' + user.token
        }
    })

    const handleProfilePic = e => {
        setPicName(e.target.files[0].name)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        const picture = e.target.picture.files[0]
        const fd = new FormData()
        firstName && fd.append('firstName', firstName)
        lastName && fd.append('lastName', lastName)
        email && fd.append('email', email)
        bio && fd.append('bio', bio)
        picture && fd.append('picture', picture)
        password && fd.append('password', password)
        const res = await fetch(REACT_APP_BASE_URL + '/users/', {
            method: 'PATCH',
            body: fd,
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        })
        const data = await res.json()
        const newUser = data.user

        if (res.ok) {
            setUser({
                token: user.token,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                picture: newUser.picture
            })
            window.location.reload(true)
        }
    }

    return (
        <div className="edit-profile-page">
            <h3>Edita tus datos:</h3>
            <form className='input-container-profile' onSubmit={handleSubmit}>
                <div className='data-container'>
                    <div className='up-container-profile'>
                        <label className='first-name-profile'>
                    Nombre
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={userData.firstName} />
                </label>
                <label className='last-name-profile'>
                    Apellidos
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={userData.lastName} />
                </label>
                <label className='email-profile'>
                    Email
                    <input value={email} onChange={e => setEmail(e.target.value)} placeholder={userData.email} />
                </label>
                <label className='confirm-email-profile'>
                    Confirma email
                    { email ? email === emailConfirm ? '✅' : '❌' : ''}
                    <input  value={emailConfirm}  onChange={e => setEmailConfirm(e.target.value)} placeholder={userData.email} />
                </label>
                    </div>
                <label className='bio-profile'>
                    Mi Bio
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder={userData.bio} />
                </label>
                <div className='down-container-profile'>
                    <label className='password-profile'>
                    Contraseña
                    <input type="password" value={password} placeholder='********' onChange={e => setPassword(e.target.value)} />
                </label>
                <label className='confirm-password-profile'>
                    Confirma contraseña
                    { password ? passConfirm === password ? '✅' : '❌' : ''}
                    <input type="password" value={passConfirm} placeholder='********' onChange={e => setPassConfirm(e.target.value)} />
                </label>
                <div className='picture-container'>
                    <label htmlFor='btn-picture' className='picture'>Editar foto...</label>
                    <span id='chosen-file'>{picName}</span>
                    <input id='btn-picture' name='picture' type="file" accept="image/x-png,image/gif,image/jpeg,image/png" hidden onChange={handleProfilePic} />
                </div>
                </div>
                </div>
                <button className='edit-button-profile'>Guardar cambios</button>
            </form>
        </div>
    )
}


const ProfileWrapper = () =>
    <Suspense fallback={<Loading className="edit-profile-page" />}>
        <EditProfile />
    </Suspense>

export default ProfileWrapper
