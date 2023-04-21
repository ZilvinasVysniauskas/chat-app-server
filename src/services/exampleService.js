const ExampleModel = require('../models/example');

class ExampleService {
    constructor() {
        this.exampleModel = new ExampleModel();
    }

    getExample() {
        return this.exampleModel;
    }
}

module.exports = new ExampleService();