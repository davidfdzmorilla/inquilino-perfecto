const { bookingsRepository, usersRepository, housesRepository } = require('../../repository')
const { bookingValidator } = require('../../validators')
const notifier = require('../../controllers/notifier')

const createBooking = async (req, res) => {
    const { startDate, endDate } = req.body
    const tenantId = Number(req.user.id)
    const { houseId } =  req.params

    const actualDate = new Date()
    if (startDate >= endDate) {
        res.status(409)
        res.end('Invalid date')
        return
    }
    if (Date.parse(startDate) < actualDate) {
        res.status(409)
        res.end('Invalid date')
        return
    }

    try {
        const bookings = await bookingsRepository.getBookingsByHouseId(houseId)
        const available = await bookingsRepository.isHouseAvailable({ bookings, startDate, endDate })
        if(!available) throw new Error ('House not available for booking in this dates')
    } catch (error) {
        res.status(409)
        res.end(error.message)
        return
    }
    try {
        const isTenantAndOwner = await bookingsRepository.checkTenantIdAndOwnerId({ tenantId, houseId })
        if(isTenantAndOwner) throw new Error ('You can not rent your own house')
    } catch (error) {
        res.status(409)
        res.end(error.message)
        return
    }
    try {
        await bookingValidator.validateAsync({  houseId, tenantId, startDate, endDate })
    } catch (error) {
        res.status(401)
        res.end(error.message)
        return
    }
    try {
        await bookingsRepository.saveBooking({  houseId, tenantId, startDate, endDate })
    } catch (error) {
        res.status(500)
        res.end(error.message)
        return
    }
    try {
        const user = await usersRepository.getUserById(tenantId)
        const email = user.email
        // await notifier.sendBookingOfferPendingTenant({ email, startDate, endDate })
    } catch (error) {
        res.status(404)
        res.end(error.message)
        return
    }
    try {
        const emailOwner = await bookingsRepository.getEmailOwner(houseId)

        console.log(houseId)
        // await notifier.sendBookingOfferPendingOwner({ emailOwner, startDate, endDate, tenantId })
    } catch (error) {
        res.status(404)
        res.end(error.message)
        return
    }
    res.status(201)
    res.send('Your booking is pending of confirm')
}
module.exports = createBooking
