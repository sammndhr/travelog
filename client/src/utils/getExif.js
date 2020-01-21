import ExifReader from 'exifreader'

function supportsFileReader() {
	return window.FileReader === undefined ? false : true
}

function readFile(file) {
	const reader = new FileReader()
	// console.log(file)
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

async function readMultipleFiles(files) {
	const promises = Object.values(files).map(async file => {
		const data = await readFile(file)
		return data
	})
	return Promise.all(promises).then(results => {
		return results
	})
}

async function readExif(files) {
	const imgsExifData = []
	const readFiles = await readMultipleFiles(files)
	for (const data of readFiles) {
		var tags = ExifReader.load(data)
		delete tags['MakerNote']
		imgsExifData.push(listTags(tags))
	}
	return imgsExifData
}

function listTags(tags) {
	const exifData = {}
	for (const name in tags) {
		exifData[name] = tags[name].description
	}
	return exifData
}

export { supportsFileReader, readExif }
