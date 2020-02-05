import ExifReader from 'exifreader'
function supportsFileReader() {
	return window.FileReader === undefined ? false : true
}

function readFileAsArrayBuffer(file) {
	const reader = new FileReader()
	return new Promise((resolve, reject) => {
		reader.onload = function(evt) {
			try {
				resolve(evt.target.result)
			} catch (error) {
				reject(error)
			}
		}
		reader.readAsArrayBuffer(file)
	})
}

async function readFile(file) {
	const res = {
		readAsArrayBuffer: await readFileAsArrayBuffer(file)
	}
	return res
}

function readExif(file) {
	const tags = ExifReader.load(file),
		exifData = {}
	delete tags['MakerNote']

	for (const name in tags) {
		exifData[name] = tags[name].description
	}

	return exifData
}

function getKeys(len) {
	let time = new Date().getTime()
	const randomNumArr = new Uint32Array(len),
		keys = []
	window.crypto.getRandomValues(randomNumArr)

	for (const num of randomNumArr) {
		const key = num.toString(36).substr(2, 5) + time.toString(36)
		keys.push(key)
		time++
	}
	return keys
}

async function handleImages(files) {
	const len = files.length,
		keys = getKeys(len),
		images = []

	// Don't use for...in, will throw err cause it'll loop through 'length' and 'item' properties
	for (const file of files) {
		const { readAsArrayBuffer } = await readFile(file),
			exif = readExif(readAsArrayBuffer),
			currKey = keys.pop()

		images.push({ key: currKey, exif, file: file })
	}
	return images
}

export { supportsFileReader, readExif, handleImages }
