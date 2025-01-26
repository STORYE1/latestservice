exports.getPagination = (page, size) => {
    const limit = size ? size * 4 : 20; 
    const offset = page ? page * limit : 0; 
    return { limit, offset };
};

exports.convertMillisecondsToHours = (milliseconds) => {
    const seconds = milliseconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    return parseInt(hours);
};