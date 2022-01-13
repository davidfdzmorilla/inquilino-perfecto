const { bookingsRepository } = require('../../repository')

const getAcceptedMadeBookings = async (req, res) => {
    const userId = req.user.id

    let bookings
    try {
        bookings = await bookingsRepository.getAcceptedMadeBookings(userId)

    } catch (error) {
        res.status(404)
        res.end(error.message)
        return
    }

    res.status(202)
    res.send(bookings)
}

module.exports = getAcceptedMadeBookings