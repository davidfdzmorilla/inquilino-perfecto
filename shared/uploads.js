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
    
    console.log(mimetypesData)
    console.log(formatedValidsMimetsypes)
    // return ALLOWED_MIMETYPES.includes(mimetype.toLowerCase())
}


  const removeFile = async (fileName) => {
    fs.remove(`${UPLOADS_PATH}/${fileName}`)
}

  const createImageName = (extension) => {
    const randomHash = crypto.randomBytes(15).toString('hex')
    return `${randomHash}.${extension}`
}

module.exports = {
    areValidImagesSize,
    areValidImagesMimeType,
    removeFile,
    createImageName
}