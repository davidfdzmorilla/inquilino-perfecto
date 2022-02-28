import { Suspense, useEffect, useState } from 'react'
import {useParams, useNavigate, Link } from "react-router-dom"
import useFetch from '../useFetch'
import Loading from '../Loading'
import { useSetModal, useUser } from '../hooks'
import './House.css'


const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL


function House() {
  const { id, startDate, endDate } = useParams()
  const navigate = useNavigate()
  const user = useUser()
  const setModal = useSetModal()
  const [mainPic, setMainPic] = useState('')
  const [stepPic, setStepPic] = useState(0)

  const house = useFetch(REACT_APP_BASE_URL + '/houses/' + id)

  const handleBooking = async e => {
    e.preventDefault()
    if(!user) {
      setModal(
        <p>Debes estar <Link to="/register" onClick={() => setModal(false)}>registrado</Link> para poder hacer una reserva.</p>
      )
      return
    }
    const res = await fetch(REACT_APP_BASE_URL + '/bookings/' + id, {
        method: 'POST',
        body: JSON.stringify({startDate, endDate}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token
        }
    })

    if(res.ok) {
        setModal(
            <div className='modal-container'>
                <p>Se ha guardado tu reserva.</p>
            </div>
        )
        navigate('/user/pending-bookings')

    } else if (res.status === 403) {
      setModal(
          <div className='modal-container'>
              <p>Para poder reservar un alojamiento debes activar primero tu usuario</p>
          </div>
      )
  } else {
      setModal(
          <div className='modal-container'>
              <p>No se ha podido realizar la reserva</p>
          </div>
      )
  }
}

const perPagePics = 9
const pagsPics = Math.ceil(house.pictures?.length / perPagePics)
const handlePrev = () => setStepPic(stepPic > 0 ? stepPic - 1 : pagsPics - 1)
const handleNext = () => setStepPic((stepPic + 1) % pagsPics)

useEffect(() => {
  setMainPic(house.pictures[0].url)
}, [house.pictures])

  return (
    <>
      {house && <section className='ad'>
            <section className='ad-info'>
              <div className='main-picture' style={{backgroundImage:`url("${REACT_APP_BASE_URL}${mainPic}")`}}></div>
              <div className='main-info'>
                <h2>🏠 {house.title}</h2>
                <span>🏙️ {house.city}</span>
                <span>🚪 {house.rooms} habitaciones</span>
                <span className='price'>🪙 {house.price}€ / Día</span>
                {startDate && endDate && <div className='dates'>
                  <div className='date'>
                    <span>📅 Fecha de entrada</span>
                    <span>{startDate}</span>
                  </div>
                  <div className='date'>
                    <span>📅 Fecha de salida</span>
                    <span>{endDate}</span>
                  </div>
                </div>}
                {startDate && endDate &&
                  <button className='booking-btn' onClick={handleBooking}>Reservar</button>
                }
              </div>
            </section>
            <section className='all-pictures'>
              <div className='pictures'>
                {house.pictures?.slice(stepPic * perPagePics, (stepPic + 1) * perPagePics).map(picture =>
                  <div key={picture.url} className='small-picture' onClick={() => setMainPic(picture.url)} style={{backgroundImage:`url("${REACT_APP_BASE_URL}${picture.url}")`}}>
                  </div>
                )}
              </div>
              <div className='pics-steps-buttons'>
                    <span className='step-button' onClick={handlePrev}>
                        ⬅️
                    </span>
                    <span>{stepPic + 1}/{Math.ceil(house.pictures?.length / perPagePics)}</span>
                    <span className='step-button' onClick={handleNext}>
                        ➡️
                    </span>
                </div>
            </section>
            <section>
              <h3>Descripción</h3>
              <p>{house.description}</p>
            </section>
            <button className='back-button' onClick={() => navigate(-1)}>Volver</button>
      </section>}
    </>
  )
}

const HouseWrapper = () =>
  <Suspense fallback={<Loading className="page" />}>
    <House />
  </Suspense>

export default HouseWrapper
