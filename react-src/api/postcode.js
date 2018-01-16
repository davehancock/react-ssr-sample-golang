const POSTCODE_ENDPOINT = './postcode/';

function postcodes(query) {

    return fetch(POSTCODE_ENDPOINT + query, {method: 'GET',})
        .then(response => response.json()
            .then(data => ({
                    data: data,
                    status: response.status
                })
            ));
}

export default postcodes
