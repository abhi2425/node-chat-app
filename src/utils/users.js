const users = []
const addUser = ({ id, username, group }) => {

    //Clean The Data
    username = username.trim().toLowerCase()
    group = group.trim().toLowerCase()

    //Validate The Data
    if (!username && !group) {
        return {
            error: "UserName and Room Must be provided!"
        }
    }
    //Check The Existing User
    const existingUser = users.find((user) => {
        return user.username === username && user.group === group
    })

    //validate user
    if (existingUser) {
        return {
            error: "Username is in use!"
        }
    }
    //store user
    const user = { id, username, group }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index != -1) {
        return users.slice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInGroup = (group) => {
    return users.filter((user) => {
        return user.group === group
    })
}
module.exports = {
    addUser,
    getUser,
    removeUser,
    getUsersInGroup
}


// addUser({ id: 25, username: "Abhinav", group: "sant" })
// addUser({ id: 5, username: "Samuel", group: "sant" })
// addUser({ id: 2, username: "vishu", group: "camp" })



// console.log(users)