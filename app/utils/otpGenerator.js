function generateOtp() {
    return Math.floor(100000 + Math.random() * 9000).toString();
}

module.exports = { generateOtp };
