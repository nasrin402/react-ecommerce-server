const cloudinary = require('cloudinary')

// CLOUDINARY_CLOUD_NAME=djkkak6ax
// CLOUDINARY_API_KEY=855126416176166
// CLOUDINARY_API_SECRET=9UQWAPRjuHUXsbtBg1SOdyMCiKQ
//config
cloudinary.config({
    cloud_name: "djkkak6ax",
    api_key: 855126416176166,
    api_secret: "9UQWAPRjuHUXsbtBg1SOdyMCiKQ"
});

exports.upload = async(req, res) =>{
    let result= await cloudinary.uploader.upload(req.body.image, {
        public_id:`${Date.now()}`,
        resource_type:'auto' // jpeg, png
    });
    res.json({
        public_id: result.public_id,
        url: result.secure_url
    });
}

exports.remove = async(req, res) =>{
    let image_id = req.body.public_id
    await cloudinary.uploader.destroy(image_id)
    res.send("ok")
}