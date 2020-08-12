const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if(file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb('Please upload only images', false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter
});

const uploadFiles = upload.array('images', 10);


const uploadImages = (req, res, next) => {
	uploadFiles(req, res, (err) => {
		if(err instanceof multer.MulterError) {
			if(err.code === 'LIMIT_UNEXPECTED_FILES') {
				return res.send('To many files to upload!');
			}
		} else if(err) {
			return next(new Error(err));
			// return res.send('ERROR' + err);
		}

		next();
	});
};

const resizeImages = async (req, res, next) => {
	if(!req.files) return next();

	req.body.images = [];
	await Promise.all(
		req.files.map(async file => {
			const fileName = file.originalname.replace(/\..+$/, '');
			const newFileName = `jayNg -- ${fileName} -- ${Date.now()}.jpeg`;

			await sharp(file.buffer)
				.resize(400, 250)
				.toFormat('jpeg')
				.jpeg({ quality: 50 })
				.toFile(`upload ${newFileName}`);

			req.body.images.push(newFileName);	
		})
	);

	next();
};

const getResult = async (req, res) => {
	if(req.body.images.length <= 0) {
		res.send('You must select at least one image to upload!');
	}

	const images = req.body.images.map(image => ` ${image} `).join('');
	return res.send(`images were upload ${images}`);
};


module.exports = {
	uploadImages: uploadImages,
	resizeImages: resizeImages,
	getResult: getResult
};