const exampleService = require('../services/exampleService');

exports.getExample = (req, res) => {
    res.json(exampleService.getExample());
}