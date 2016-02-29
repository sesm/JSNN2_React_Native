var _ = require('lodash');
var DOMParser = require('xmldom').DOMParser;

function cats() {
    return fetch('http://thecatapi.com/api/images/get?format=xml&results_per_page=10&size=small', {method: 'GET'})
        .then(response => response.text())
        .then(text => {
            var parser = new DOMParser();
            var images = parser
                .parseFromString(text, "text/xml").documentElement
                .getElementsByTagName("data")[0]
                .getElementsByTagName("images")[0]
                .getElementsByTagName("image");
            return _.map(images, image => {
                return {
                    url: image.getElementsByTagName('url')[0].childNodes[0].nodeValue,
                    id: image.getElementsByTagName('id')[0].childNodes[0].nodeValue
                }
            });
        });
}

module.exports = cats;