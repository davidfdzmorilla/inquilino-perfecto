import './TenantProfile.css'
import { Suspense, useState } from "react"
import Loading from "../Loading"
import useFetch from "../useFetch"
import { Link } from 'react-router-dom'
import ScoreToOwner from './ScoreToOwner'
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL


function Puntuacion({ value }) {
    return (
        <span className="puntuacion">
            {value >= 1 ? '★' : '☆'}
            {value >= 2 ? '★' : '☆'}
            {value >= 3 ? '★' : '☆'}
            {value >= 4 ? '★' : '☆'}
            {value >= 5 ? '★' : '☆'}
        </span>
    )
}


function TenantProfile() {
    const bookingsData = useFetch(REACT_APP_BASE_URL + '/bookings/made/accepted')
    const ratingsData = useFetch(REACT_APP_BASE_URL + '/users/ratings/tenant')
    let classNameDisplayPage
    let classNameDisplayMessage
    if (bookingsData.length === 0) {
        classNameDisplayPage = 'tenant-profile-page-off'
        classNameDisplayMessage = 'tenant-profile-error-message-on'
    } else {
        classNameDisplayPage = 'tenant-profile-page-on'
        classNameDisplayMessage = 'tenant-profile-error-message-off'
    }


    let totalRatings = 0
    ratingsData?.map(rating =>
        totalRatings = totalRatings + rating.rating,
    )
    let averageRatings = totalRatings / ratingsData?.length

    let classNameForSvgAverageRatings
    averageRatings >= 2.5 ? classNameForSvgAverageRatings = 'smile-svg' : classNameForSvgAverageRatings = 'sad-svg'

    let classNameForColorAverageRatings
    averageRatings >= 2.5 ? classNameForColorAverageRatings = 'rgba(195, 236, 176, 0.259)' : classNameForColorAverageRatings = 'rgba(236, 176, 176, 0.259)'


    const [stepBooking, setStepBooking] = useState(0)
    const [stepRating, setStepRating] = useState(0)

    const perPageBookings = 3
    const pagsBookings = Math.ceil(bookingsData?.length / perPageBookings)
    const handlePrevBookings = () => setStepBooking(stepBooking > 0 ? stepBooking - 1 : pagsBookings - 1)
    const handleNextBookings = () => setStepBooking((stepBooking + 1) % pagsBookings)

    const perPageRatings = 4
    const pagsRatings = Math.ceil(ratingsData?.length / perPageRatings)
    const handlePrevRatings = () => setStepRating(stepRating > 0 ? stepRating - 1 : pagsRatings - 1)
    const handleNextRatings = () => setStepRating((stepRating + 1) % pagsRatings)


    return bookingsData && (
        <>

            <section className={classNameDisplayMessage}>
                <span>❌ </span>
                <p>Opps, parece que todavía no reservaste con nosotros. 😞</p>
            </section>


            <section className={classNameDisplayPage}>
                <h2>Histórico de alquileres</h2>
                <section className="historic-bookings-container">
                    {bookingsData?.slice(stepBooking * perPageBookings, (stepBooking + 1) * perPageBookings).map(booking =>
                        <article className='card-house-historic-booking' key={Math.random()}>
                            <div key={booking.housePicUrl} className="picture-historic-booking" style={{ backgroundImage: `url(${REACT_APP_BASE_URL}${booking.housePicUrl})` }} ></div>
                            <Link key={booking.houseTitle} to={'/houses/' + booking.houseId} className='title-historic-booking'>{booking.houseTitle}<span> ➕info</span></Link>
                            <p key={booking.startDate} className='date-historic-booking' >Desde el {booking.startDate.slice(0, 10)} hasta el {booking.endDate.slice(0, 10)}</p>
                            <p key={booking.endDate} className='state-booking'>{Date.parse(booking.endDate) < new Date() && <ScoreToOwner bookingId={booking.bookingId} />}</p>
                        </article>
                    )}
                </section>
                <section className='button-steps-container-bookings'>
                    <span onClick={handlePrevBookings}>
                        ⬅️
                    </span>
                    <span>{stepBooking + 1}/{Math.ceil(bookingsData.length / perPageBookings)}</span>
                    <span onClick={handleNextBookings}>
                        ➡️
                    </span>
                </section>
                <h2>Valoraciones recibidas como inquilino</h2>
                <section className="historic-ratings-container">
                    <div className='ratings-container'>
                        <section className='cards-ratings-container'>
                        {ratingsData?.slice(stepRating * perPageRatings, (stepRating + 1) * perPageRatings).map(rating =>
                            <article className='card-historic-rating' key={rating.ratingDate}>
                                <Puntuacion key={rating.rating} value={rating.rating} />
                                <span key={rating.ratingDate} className='date-rating'>{rating.ratingDate.slice(0, 10)}</span>
                            </article>
                        )}
                        </section>
                        <section className='button-steps-container-ratings'>
                            <span onClick={handlePrevRatings}>
                                ⬅️
                            </span>
                            <span>{stepRating + 1}/{Math.ceil(ratingsData.length / perPageRatings)}</span>
                            <span onClick={handleNextRatings}>
                                ➡️
                            </span>
                        </section>
                    </div>
                    <section className='average-ratings' style={{ backgroundColor: `${classNameForColorAverageRatings}` }}>
                        <h3>Media de valoraciones</h3>
                        <span className='average-ratings-number'>{averageRatings.toFixed(1)}</span>
                        <Puntuacion value={averageRatings} />
                        <span className={classNameForSvgAverageRatings}></span>
                    </section>
                </section>
            </section>
        </>

    )
}

const ProfileWrapper = () =>
    <Suspense fallback={<Loading className="historic-bookings-container" />}>
        <TenantProfile />
    </Suspense>

export default ProfileWrapper
