const router = require('express').Router();
const inside = require('point-in-polygon');
const tj = require('togeojson');
const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;
const NodeGeocoder = require('node-geocoder');

// configure geocoder
const options = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(options);

//@route GET /getOutletIdentifier
//@description returns outlet identifier
router.get('/getOutletIdentifier' , async (req, res) => {
    let data = {
        message: "success"
    };

    const address = req.query.address;
    if (!address.length) {
        return res.status(400).json([{
            "message": "address query param missing"
        }]);
    }

    // get address coordinates
    const locationData = await geocoder.geocode(address);
    if (!locationData.length) {
        return res.status(400).json([{
            "message": "Invalid address query param"
        }]);
    }

    const location = [
        locationData[0].longitude,
        locationData[0].latitude
    ];

    try {
        data["identifier"] = "";

        // convert kml to json formate
        let kml = new DOMParser().parseFromString(fs.readFileSync('delivery_areas.kml', 'utf8'));
        let geoJson = tj.kml(kml, { styles: true });

        // logic to check if address exists in anyone of the polygons
        const geoJsonFeatures = geoJson.features;
        for(let i = 0; i < geoJsonFeatures.length; i++) {
            if (geoJsonFeatures[i].geometry.type == "Polygon") {
                if (inside(location, geoJsonFeatures[i].geometry.coordinates[0])) {
                    data["identifier"] = geoJsonFeatures[i].properties.name;
                    break;
                }
            } else if (geoJsonFeatures[i].geometry.type == "Point") {
                // compare the coordinates here directly!!
            }
        }

        // if location not found
        if (!data["identifier"]) {
            data["message"] = "not found!"
        }
    } catch(err) {
        return res.status(500).json([{
            "message": "Something went wrong!!",
        }]);
    }

    res.status(200).json([data]);

});

module.exports = router;
