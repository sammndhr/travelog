let configVars

if (process.env.NODE_ENV === 'production') configVars = process.env
else configVars = require('./DO_NOT_COMMIT.env.vars')

const {
	JWT_SECRET,
	MAPBOX_TOKEN,
	PSQL,
	S3_KEY,
	S3_SECRET,
	S3_REGION,
	S3_BUCKET,
	S3_HOST,
	S3_BUCKET_REGION
} = configVars

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

	psql: JSON.parse(PSQL),

	mapbox: { token: MAPBOX_TOKEN },

	jwt: { secret: JWT_SECRET }
}

module.exports = config
