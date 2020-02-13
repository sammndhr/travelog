const {
	JWT_SECRET,
	MAPBOX_TOKEN,
	DATABASE_URL,
	S3_KEY,
	S3_SECRET,
	S3_REGION,
	S3_BUCKET,
	S3_HOST,
	S3_BUCKET_REGION
} = process.env

const config = {
	s3: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET,
		region: S3_REGION,
		apiVersion: '2006-03-01',
		bucket: S3_BUCKET,
		host: S3_HOST,
		bucketRegion: S3_BUCKET_REGION
	},

	psql: { connectionString: DATABASE_URL },

	mapbox: { token: MAPBOX_TOKEN },

	jwt: { secret: JWT_SECRET }
}

module.exports = config
