import './PendingBookings.css'
import { Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import useFetch from '../useFetch'
import { useModal, useSetModal, useUser } from '../hooks'
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL


function Puntuacion({ value }) {
    return (
        <span className="rating-tenant">
            {value >= 1 ? '★' : '☆'}
            {value >= 2 ? '★' : '☆'}
            {value >= 3 ? '★' : '☆'}
            {value >= 4 ? '★' : '☆'}
            {value >= 5 ? '★' : '☆'}
        </span>
    )
}


// TODO
//  PONER MENSAJE DE ERROR EN EDITPROFILE

function PendingBookings() {

    const dataReceivedBookings = useFetch(REACT_APP_BASE_URL + '/bookings/received/pending')

    const user = useUser()
    const setModal = useSetModal()
    const modal = useModal()


    const handleConfirmBooking = async e => {
        const res = await fetch(REACT_APP_BASE_URL + '/bookings/confirm/' + e.target.attributes.bookingId.value, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        })
        if (res.ok) {
            setModal(
                <article className='confirm-booking-message-container'>
                    <span>✅</span>
                    <p>Reserva confirmada correctamente.</p>
                    <Link className='link-modal-confirm-booking' to='/user/pending-bookings' onClick={e => modal(false)} >Aceptar</Link>
                </article>
            )
            modal(true)
        }
    }

    const handleCancelBooking = async e => {
        console.log(e.target.attributes.bookingId.value)
        const res = await fetch(REACT_APP_BASE_URL + '/bookings/cancel/' + e.target.attributes.bookingId.value, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + user.token
            }
        })
        if (res.ok) {
            setModal(
                <article className='cancel-booking-message-container'>
                    <span>✅</span>
                    <p>Reserva cancelada correctamente.</p>
                    <Link className='link-modal-cancel-booking' to='/user/pending-bookings' onClick={e => modal(false)} >Aceptar</Link>
                </article>
            )
            modal(true)
        }
    }

    const [stepBooking, setStepBooking] = useState(0)

    const perPageBookings = 3
    const pagsBookings = Math.ceil(dataReceivedBookings?.length / perPageBookings)
    const handlePrevBookings = () => setStepBooking(stepBooking > 0 ? stepBooking - 1 : pagsBookings - 1)
    const handleNextBookings = () => setStepBooking((stepBooking + 1) % pagsBookings)

    return(
        <section className="pending-bookings-page">
            <section className="received-pending-bookings-container">
                <h3>Peticiones de alquiler recividas pendientes</h3>
                {dataReceivedBookings?.slice(stepBooking * perPageBookings, (stepBooking + 1) * perPageBookings).map(booking =>
                            <article className='card-received-booking' key={Math.random()}>
                                <div key={booking.housePicUrl} className="picture-received-booking" style={{ backgroundImage: `url(${REACT_APP_BASE_URL}${booking.housePicUrl})`}} ></div>
                                <Link key={booking.title} to={'/houses/' + booking.houseId} className='title-received-booking'>{booking.title}<span> ➕info</span></Link>
                                <div className='tenant-data-container'>
                                <div className='tenant-avatar' key={booking.tenantPicture} style={{ backgroundImage: `url(${REACT_APP_BASE_URL}${booking.tenantPicture})`}} />
                                <p className='name-tenant' key={booking.tenantFirstName}>{booking.tenantName} {booking.tenantLastName}</p>
                                <Puntuacion className='rating-tenant' key={booking.ratingAvg}>{booking.ratingAvg}</Puntuacion>
                                </div>
                                <p key={booking.startDate} className='date-received-booking' >Desde el {booking.startDate.slice(0, 10)} hasta el {booking.endDate.slice(0, 10)}</p>
                                <div className='buttons-received-bookings'>
                                <span bookingid={Number(booking.bookingId)} onClick={handleConfirmBooking}>Aceptar</span>
                                <span bookingid={Number(booking.bookingId)} onClick={handleCancelBooking}>Cancelar</span>
                                </div>
                            </article>
                )}
            </section>
            <section className='button-steps-container-bookings'>
                    <span onClick={handlePrevBookings}>
                        ⬅️
                    </span>
                    <span>{stepBooking + 1}/{Math.ceil(dataReceivedBookings.length / perPageBookings)}</span>
                    <span onClick={handleNextBookings}>
                        ➡️
                    </span>
                </section>
        </section>
    )
}

const pendingBookingsWrapper = () =>
    <Suspense fallback={<Loading className="pending-bookings-page" />}>
        <PendingBookings />
    </Suspense>

export default pendingBookingsWrapper
