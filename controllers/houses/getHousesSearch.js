const { housesRepository, bookingsRepository } = require('../../repository')

const getHousesSearch = async (req, res) => {
    const { city, price, rooms, startDate, endDate } = req.query

    if(!startDate || !endDate) {
        res.status(400)
        res.end('Booking dates are required')
    }

    let resultHouses
    try {
        const houses = await housesRepository.getHousesByQuery(city, price, rooms)
        housesWithBookings = await Promise.all(houses.map(async house =>  {
            const bookings = await bookingsRepository.getBookingsByHouseId(house.id)
            return { ...house, bookings }
        }))

        const availableHouses = await Promise.all(housesWithBookings.filter(async house => {
            console.log(house.bookings, house.id, startDate, endDate, await bookingsRepository.isHouseAvailable(house.bookings, startDate, endDate))
            return await bookingsRepository.isHouseAvailable(house.bookings, startDate, endDate)
        }))

        resultHouses = availableHouses.map(house => {
            const [ housePicture ] = house.pictures
            return {
                id: house.id,
                city: house.city,
                price: house.price,
                rooms: house.rooms,
                picture: housePicture
            }
        })

    } catch (error) {
        res.status(500)
        res.end(error.message)
    }

    res.status(200)
    res.send(resultHouses)
}

module.exports = getHousesSearch
