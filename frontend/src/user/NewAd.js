import './NewAd.css'
import PicUpload from './PicUpload';
import { useState } from "react"
import { useSetModal, useUser } from '../hooks'
import { useNavigate } from 'react-router-dom';

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL

function NewAd() {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [rooms, setRooms] = useState('')
    const [description, setDescription] = useState('')
    const [city, setCity] = useState('')
    const [pictures, setPictures] = useState([])
    const [error, setError] = useState()
    const user = useUser()
    const Navigation = useNavigate()
    const setModal = useSetModal()
    const handleSubmit = async e => {
        e.preventDefault()
        const fd = new FormData()
        fd.append('title', title)
        fd.append('price', price)
        fd.append('rooms', rooms)
        fd.append('description', description)
        fd.append('city', city)
        for (const p of pictures) {
            fd.append('pictures', p.file)
        }
        const res = await fetch(REACT_APP_BASE_URL +'/houses/', {
            method: 'POST',
            body: fd,
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        })
        let data = await res.json()

        if (res.ok) {
            setModal(<p>{`Has publicado tu anuncio ${title} con exito!!!`}</p>)
            Navigation('/')
        } else {
            setError(data.error)
        }
    }
    return (
        <div className='ad-page'>
            <p className='title-ad-page'>Datos del anuncio</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Titulo <br/>
                        <input name='title' value={title} type='text' placeholder='Titulo...' onChange={e => setTitle(e.target.value)} />
                    </label>
                    <label>
                        Precio <br/>
                        <input name='price' value={price} type='number' placeholder='Precio...' onChange={e => setPrice(e.target.value)} />
                    </label>
                    <label>
                        Habitaciones <br/>
                        <input name='rooms' value={rooms} type='number' placeholder='Habitaciones...' onChange={e => setRooms(e.target.value)} />
                    </label>
                    <label>
                        Ciudad <br/>
                        <input name='city' value={city} type='text' placeholder='Ciudad...' onChange={e => setCity(e.target.value)} />
                    </label>
                </div>
                <div className='description-house'>
                    <label>
                        Descripción <br />
                        <textarea name='description' value={description} placeholder='Descripción...' onChange={e => setDescription(e.target.value)} />
                    </label>
                </div>
                <div>
                    <PicUpload pictures={pictures} onChange={setPictures}/>
                </div>
                <button id='ad-button'>
                    Publicar
                </button>
                {error && <div className="error">{error}</div>}
            </form>
        </div>
    )
}

export default NewAd
