function inBounds({ bounds, longitude, latitude }) {
	var lng = (longitude - bounds._ne.lng) * (longitude - bounds._sw.lng) < 0
	var lat = (latitude - bounds._ne.lat) * (latitude - bounds._sw.lat) < 0
	return lng && lat
}

function filterInBoundsGeoJson({ geoJson, bounds }) {
	const filteredGeoJson = {
			type: 'FeatureCollection',
			features: []
		},
		features = geoJson.features
	//This won't work for "Symbol features that have been hidden due to text or icon collision." :/
	// const features = map.queryRenderedFeatures({ layers: ['images'] })
	// https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures

	if (features) {
		filteredGeoJson.features = features.filter(feature => {
			const [longitude, latitude] = feature.geometry.coordinates,
				isRendered = inBounds({ longitude, latitude, bounds })
			return isRendered
		})
		return filteredGeoJson
	}
}
export { inBounds, filterInBoundsGeoJson }
