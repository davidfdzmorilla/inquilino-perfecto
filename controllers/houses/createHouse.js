const fs = require('fs-extra')
const { houseSchema } = require('../../validators')
const { housesRepository } = require('../../repository/')
const uploads = require('../../shared/uploads')


const { MAX_IMAGE_SIZE_IN_BYTES, UPLOADS_PATH } =  process.env


// TODO 
//  En la función si es valido el formato hay que comparar los dos arrays

const createHouse = async (req, res) => {
    let insertId
    let house = req.body
    
    // if(!req.files || !req.files.picture) {
    //     res.status(400)
    //     res.end('[picture] is required')
    //     return
    // }
    const pictures = [
        {
            name: 'autumn-g820e3a0f3_1920.jpg',
            data: '<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 05 03 04 04 04 03 05 04 04 04 05 05 05 06 07 0c 08 07 07 07 07 0f 0b 0b 09 ... 729935 more bytes>',
            size: 729985,
            encoding: '7bit',
            tempFilePath: '',
            truncated: false,
            mimetype: 'image/jpg',
            md5: '39a8999e24444189abe284da4763541a',
            mv: '[Function: mv]'
        },
        {
            name: 'slon-con-cocina.jpg',
            data: '<Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 05 03 04 04 04 03 05 04 04 04 05 05 05 06 07 0c 08 07 07 07 07 0f 0b 0b 09 ... 729935 more bytes>',
            size: 729985,
            encoding: '7bit',
            tempFilePath: '',
            truncated: false,
            mimetype: 'image/jpeg',
            md5: '39a8999e24444189abe284da4763541a',
            mv: '[Function: mv]'
        }
    ]

    house = { ...house, pictures: pictures}

    try {
            await houseSchema.validateAsync(house)
            if(house.pictures.length < 2) throw new Error ('Must upload at least two pictures')
        } catch (error) {
                res.status(401)
                res.end(error.message)
                return
            }
            if (!uploads.areValidImagesSize(pictures)) {
        res.status(400)
        res.end(`Picture size should be less than ${MAX_IMAGE_SIZE_IN_BYTES / 1000000} Mb`)
        return
    }
    
    if (!uploads.areValidImagesMimeType(pictures)) {
        res.status(400)
        res.end('No valid mime type')
        return
    }
    // const pictureName = uploads.createImageName(uploads.getExtensionFromMimetype(pictures.mimetype))
    // const picturesUrl = `${UPLOADS_PATH}/${pictureName}`

    // try {
        
    //         insertId = await housesRepository.saveHouse({ ...house, ownerId: req.user.id, pictures: picturesUrl })
    //         console.log(house)
    //     } catch (error) {
    //             res.status(500)
    //             res.end(error.message)
    //             return
    //         }
    //         fs.ensureDir(UPLOADS_PATH)
    //         pictures.mv(`${UPLOADS_PATH}/${pictureName}`)
    // res.status(201)
    // res.send(`Created new house`)
    res.send(`Created new house with id ${insertId}`)
}

module.exports = createHouse
