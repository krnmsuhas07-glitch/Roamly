
const mapElement = document.getElementById("map");

// Stop if this page doesn't contain a map
if (mapElement) {

    // Get data passed from EJS
    const coordinates = JSON.parse(mapElement.dataset.coordinates);
    const mapToken = mapElement.dataset.mapToken;

    // Validate data
    if (
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        !mapToken
    ) {
        console.error("Map coordinates or access token missing");
    } else {

        mapboxgl.accessToken = mapToken;

        // Initialize map
        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/standard-satellite",
            center: coordinates,
            zoom: 13
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add marker
        const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            closeOnClick: false
        }).setText(mapElement.dataset.title);

        const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(popup)
            .addTo(map);

        marker.getElement().addEventListener("mouseenter", () => {
            marker.togglePopup();
        });

        marker.getElement().addEventListener("mouseleave", () => {
            marker.togglePopup();
        });

        // Map style switching
        const layerList = document.getElementById("menu");

        if (layerList) {
            const inputs = layerList.querySelectorAll("input");

            const styles = {
                "standard-satellite": "mapbox://styles/mapbox/standard-satellite",
                "standard": "mapbox://styles/mapbox/standard",
                "outdoors-v12": "mapbox://styles/mapbox/outdoors-v12"
            };

            inputs.forEach((input) => {
                input.addEventListener("change", () => {
                    const style = styles[input.id];

                    if (style && input.checked) {
                        map.setStyle(style);
                    }
                });
            });
        }

        console.log("Map initialized successfully!");
    }
}
