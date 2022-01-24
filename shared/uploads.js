const { MAX_IMAGE_SIZE_IN_BYTES, UPLOADS_PATH } =  process.env

const ALLOWED_MIMETYPES = ['image/jpg', 'image/jpeg', 'image/png']

const crypto = require('crypto')
const { invalid } = require('joi')
const mimeTypes = require('nodemailer/lib/mime-funcs/mime-types')


const areValidImagesSize = (picturesData) => {
  const areValid = picturesData.find(picture => picture.size >= MAX_IMAGE_SIZE_IN_BYTES)
  if (areValid) return false
  return true
}

  const areValidImagesMimeType = (picturesData) => {
    let mimetypesData = []
    picturesData.map(function(picture) {
      let mimetype =  picture.mimetype.toLowerCase()
      mimetype = mimetype.split('/')[1]
      mimetypesData.push(mimetype)
    })
    const formatedValidsMimetsypes = []
    ALLOWED_MIMETYPES.map(function(validMimetype) {
      let mimetype =  validMimetype.toLowerCase()
      mimetype = mimetype.split('/')[1]
      formatedValidsMimetsypes.push(mimetype)
    })
    const arrayComparacion = mimetypesData.filter(pos => formatedValidsMimetsypes.includes(pos))
    if(arrayComparacion.length !== mimetypesData.length) {
      return false
    } else {
      return arrayComparacion
    }

}

const getExtensionFromMimetype = (pictures) => {
  let picturesMimetypes = []
  pictures.map(picture => {
    picturesMimetypes.push(picture.mimetype.split('/')[1])
  })
  return picturesMimetypes
}


  const createImageName = (pictures) => {
    let picturesName = []
    pictures.map(picture => {
      picturesName.push(`${crypto.randomBytes(15).toString('hex')}.${picture}`)
    })
    return picturesName
}

module.exports = {
    areValidImagesSize,
    areValidImagesMimeType,
    getExtensionFromMimetype,
    createImageName
}