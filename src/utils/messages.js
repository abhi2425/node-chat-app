const generateMessage = (text, username) => {
    const now = new Date()
    return {
        text,
        username,
        createdAt: now.getTime()
    }
}
const generateLocation = (text, username) => {
    const now = new Date()
    return {
        text,
        username,
        createdAt: now.getTime()
    }

}
module.exports = {
    generateMessage,
    generateLocation
}