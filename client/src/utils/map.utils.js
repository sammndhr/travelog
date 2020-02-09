function inBounds({ bounds, longitude, latitude }) {
	var lng = (longitude - bounds._ne.lng) * (longitude - bounds._sw.lng) < 0
	var lat = (latitude - bounds._ne.lat) * (latitude - bounds._sw.lat) < 0
	return lng && lat
}

function filter({ geoJson, bounds }) {
	const features = geoJson.features,
		//This won't work for "Symbol features that have been hidden due to text or icon collision." :/
		// const features = map.queryRenderedFeatures({ layers: ['images'] })
		// https://docs.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures

		filteredGeoJson = []

	if (features) {
		for (const feature of features) {
			if (feature) {
				const [longitude, latitude] = feature.geometry.coordinates,
					isRendered = inBounds({ longitude, latitude, bounds })
				if (isRendered) filteredGeoJson.push(feature)
			}
		}
		return filteredGeoJson
	}
}
export { inBounds, filter }
