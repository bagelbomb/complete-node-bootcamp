export const displayMap = locations => {
  // TODO: install mapbox with npm instead of using script tag?

  // TODO: move this into config.env?
  mapboxgl.accessToken =
    '';

  const map = new mapboxgl.Map({
    container: 'map',
    style: '',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create location marker:
    const markerDiv = document.createElement('div');
    markerDiv.className = 'marker';

    const marker = new mapboxgl.Marker({
      element: markerDiv,
      anchor: 'bottom',
    });

    marker.setLngLat(loc.coordinates);
    marker.addTo(map);

    // Create location popup:
    const popup = new mapboxgl.Popup({
      offset: 30,
    });

    popup.setLngLat(loc.coordinates);
    popup.setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`);
    popup.addTo(map);

    // Extend map bounds to include the current location:
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
