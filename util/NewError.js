export default class NewError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}