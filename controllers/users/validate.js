const { usersRepository } = require('../../repository')

const validate = async (req, res) => {
    const { activationCode } = req.params
    let user
    try {
        const activationCodeMatches = await usersRepository.getUsersByActivationCode(activationCode)
        if(activationCodeMatches.length > 1) throw new Error('Duplicated activation code')

        user = activationCodeMatches[0]
        if (!!!user) throw new Error('Invalid activation code')

        await usersRepository.activateUser(user)

    } catch (error) {
        res.status(401)
        res.end(error.message)
        return
    }
    res.status(202)
    res.send('User validated')
}

module.exports = validate



