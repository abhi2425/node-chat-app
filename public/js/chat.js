const socket = io()

//Elements
const $messageForm = document.querySelector(".messageForm")
const $messageInput = document.querySelector("#message")
    //  const mssg = e.target.elements.mssg.value
const btn = document.querySelector(".btn")
const sendLocation = document.querySelector(".sendLocation")
const $messageBlocks = document.querySelector(".messageBlocks")

//Templates
const $messageTemplate = document.querySelector("#messageTemplate").innerHTML
const $locationMessageTemplate = document.querySelector("#locationMessageTemplate").innerHTML
const $sidebarTemplate = document.querySelector("#sidebarTemplate").innerHTML

//Options
const { username, group } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messageBlocks.insertAdjacentHTML('beforeend', html)
})
socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render($locationMessageTemplate, {
        username: url.username,
        url: url.text,
        createdAt: moment(url.createdAt).format("h:mm a")
    })
    $messageBlocks.insertAdjacentHTML('beforeend', html)
})

socket.on('groupData', ({ group, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        group,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

btn.addEventListener("click", (e) => {
    const message = document.querySelector("#message").value
    e.preventDefault()
        //Disabling button 
    btn.setAttribute('disabled', 'disabled')
    socket.emit('displayMessage', message, () => {
        //Enabling button
        btn.removeAttribute('disabled')
            // $messageInput.value = ''
            // $messageInput.focus()
        console.log("Message is Delivered")
    })
})


sendLocation.addEventListener("click", (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        alert("Your Browser Dosen't Support Geolocation!!")
    }
    sendLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude || 0
        const long = position.coords.longitude || 0
        const location = {
            lat,
            long
        }
        socket.emit('sendLocation', location, () => {
            sendLocation.removeAttribute('disabled')
            console.log("Location Send!!")
        })

    })
})
socket.emit('join', { username, group }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})