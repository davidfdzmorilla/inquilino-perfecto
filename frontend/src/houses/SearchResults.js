import useFetch  from '../useFetch'
import { useQuery }  from '../hooks'
import './SearchResults.css'
import { useNavigate, Link } from 'react-router-dom'
import { useState, Suspense } from 'react'
import { useModal, useSetModal, useUser } from '../hooks'
import Loading from '../Loading'

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL


function SearchResults() {
    const user = useUser()
    const modal = useModal()
    const setModal = useSetModal()
    const navigate = useNavigate()
    const query = useQuery()
    const city = query.get('city')
    const price = query.get('price')
    let rooms = query.get('rooms')
    const startDate = query.get('startDate')
    const endDate = query.get('endDate')
    const [sortCriterion, setSortCriterion] = useState('title')
    const [sortOrder, setSortOrder] = useState('asc')
    const [stepHouse, setStepHouse] = useState(0)


    let fetchUrl = `${REACT_APP_BASE_URL}/houses?startDate=${startDate}&endDate=${endDate}`
    if(query.get('city')) fetchUrl += '&city=' + city
    if(rooms) fetchUrl += '&rooms=' + rooms
    if(price) fetchUrl += '&price=' + price

    const handleFilter = e => {
        e.preventDefault()
        const remove = e.target.parentElement.dataset.remove
        let navUrl = `/houses/search/?startDate=${startDate}&endDate=${endDate}`
        if(remove !== 'city' && query.get('city')) navUrl += '&city=' + query.get('city')
        if(remove !== 'rooms' && query.get('rooms')) navUrl += '&rooms=' + query.get('rooms')
        if(remove !== 'price' && query.get('price')) navUrl += '&price=' + query.get('price')
        navigate(navUrl)
    }

    const handleBooking = async e => {
        e.preventDefault()
        const res = await fetch(REACT_APP_BASE_URL + '/bookings/' + e.target.dataset.houseid, {
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
                    <p>Reserva confirmada.</p>
                    <Link className='modal-link' to='/user/pending-bookings' onClick={e => modal(false)} >Continuar</Link>
                </div>
            )
        } else {
            setModal(
                <div className='modal-container'>
                    <p>No se ha podido realizar la reserva.</p>
                </div>
            )
        }
    }

    const results = useFetch(fetchUrl)
    if(results &&  results.length > 0 && sortCriterion) {
        if(sortOrder === 'asc') results.sort((house1, house2) => house1[sortCriterion] > house2[sortCriterion] ? 1 : house1[sortCriterion] < house2[sortCriterion] ? -1 : 0)
        else results.sort((house1, house2) => house1[sortCriterion] < house2[sortCriterion] ? 1 : house1[sortCriterion] > house2[sortCriterion] ? -1 : 0)
    }

    const perPageHouses = 4
    const pagsHouses = Math.ceil(results?.length / perPageHouses)
    const handlePrev = () => setStepHouse(stepHouse > 0 ? stepHouse - 1 : pagsHouses - 1)
    const handleNext = () => setStepHouse((stepHouse + 1) % pagsHouses)

    return(
        <>
            <div className='filters'>
                <div className='sort-container'>
                    <span>Ordenar por:</span>
                    <select onChange={e => setSortCriterion(e.target.value)}>
                        <option value="title">nombre</option>
                        <option value="price">precio</option>
                        <option value="rooms">habitaciones</option>
                    </select>
                    <div className='sort-buttons'>
                        <span className='sort-button' onClick={() => setSortOrder('desc')}>⬇️</span>
                        <span className='sort-button' onClick={() => setSortOrder('asc')}>⬆️</span>
                    </div>
                </div>
                {city&&<div className='filter' data-remove="city">{city}<span className='remove-filter' onClick={handleFilter}>❌</span></div>}
                {price&&<div className='filter' data-remove="price">{price}€<span className='remove-filter' onClick={handleFilter}>❌</span></div>}
                {rooms&&<div className='filter' data-remove="rooms">{+query.get('rooms') === 4 ? '+3' : query.get('rooms')} hab<span className='remove-filter' onClick={handleFilter}>❌</span></div>}
            </div>
            {results && results.length < 1 &&
                <div>No se han encontrado resultados</div>
            }
            {results && results.length > 0 && <>
                <section className="search-results">
                {results.slice(stepHouse * perPageHouses, (stepHouse + 1) * perPageHouses).map(house =>
                    <article key={house.id} className="house">
                        <div className='house-picture' style={{backgroundImage:`url("${REACT_APP_BASE_URL}${house.picture.url}")`}}></div>
                        <div className='house-info'>
                            <Link to={`/houses/${house.id}/${startDate}/${endDate}`}>{house.title}</Link>
                            <span className='rooms'>{house.city}</span>
                            <span className='rooms'>{house.rooms} habitaciones</span>
                            <span className='price'>{house.price}€ / día</span>
                        </div>
                        <button className='booking-button' data-houseid={house.id} onClick={handleBooking}>Reservar</button>
                    </article>
                )}
                </section>
                <div className='button-steps-container-bookings'>
                    <span onClick={handlePrev}>
                        ⬅️
                    </span>
                    <span>{stepHouse + 1}/{Math.ceil(results.length / perPageHouses)}</span>
                    <span onClick={handleNext}>
                        ➡️
                    </span>
                </div>
            </>}
        </>
    )
}

const SearchResultsWrapper = () =>
    <Suspense fallback={<Loading className="search-results-page" />}>
        <SearchResults />
    </Suspense>

export default SearchResultsWrapper