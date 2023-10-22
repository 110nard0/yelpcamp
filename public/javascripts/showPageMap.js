mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/satellite-v9',
	// style: 'mapbox://styles/mapbox/light-v10',
	// style: 'mapbox://styles/mapbox/dark-v10',
	// style: 'mapbox://styles/mapbox/outdoors-v11',
	// style: 'mapbox://styles/mapbox/streets-v12',
	center: campground.geometry.coordinates,
	zoom: 10
})

const marker = new mapboxgl.Marker()
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 })
			.setHTML(
				`<h6>${campground.title}</h6><p>${campground.location}</p>`
			)
	)
	.addTo(map)