const socket = io()
const messages = document.querySelector('section ul')
const input = document.querySelector('input')
const form = document.querySelector('form')
const userIcons = document.querySelector('.user-count-container')
const username = prompt('What is your name?')
const USERNAME_MIN_LENGTH = 3
const count = document.querySelector('#count')
const typing = document.querySelector('.typing')
console.log(typing.innerHTML)
console.log(input)
while (username === null || username.length < USERNAME_MIN_LENGTH) {
  username = prompt(
    `Username must be longer than ${USERNAME_MIN_LENGTH} characters`
  )
}


newUser('You joined')
socket.emit('new-user', username)

form.addEventListener('submit', submitMessage)

input.addEventListener('keypress', userTyping)



function submitMessage(event) {
  event.preventDefault()
  const message = input.value
  if (input.value === '') return
  appendMessage(`<p class="name">Jij</p> ${message}`)
  socket.emit('send-message', message)
  input.value = ''
}

socket.on('send-message', message => {

  appendMessage(`<p class="name">${message.username}</p> ${message.message}`)
})

socket.on('user-connected', username => {
  newUser(`${username} connected`)
})


socket.on('user-disconnected', username => {
  newUser(`${username} disconnected`)
})

socket.on('usercount', (data) => {
  count.innerHTML = data;
})




socket.on('chat-message', (data) => {
  receivedMessage(`<p class="name">${data.username}</p> ${data.message}`);

})




socket.on('update-user-icons', users => {
  userIcons.innerHTML = ''
  const userList = Object.values(users)


  userList.forEach(user => {
    userIcons.insertAdjacentHTML('beforeend',
      `    
          <div class="user-icon" title="${user}">
          <p>${user[0]+ user[1] + user[2]}</p>
          </div>
      `
    )
  })
})

function appendMessage(message) {
  typing.innerHTML = ''
  const date = new Date()
  const hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours()
  const minutes =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes()
  const time = `${hours}:${minutes}`


  messages.insertAdjacentHTML(
    'beforeend',
    `
	  <li class="message-container">
    <p >${message}</p>
    <p class="time">${time}</p>
  </li>
	`
  )
  messages.scrollTop = messages.scrollHeight
}




function newUser(message) {


  messages.insertAdjacentHTML(
    'beforeend',
    `
	  <p class="user-info">${message}</p>
	`
  )
  messages.scrollTop = messages.scrollHeight
}



function receivedMessage(message) {
  typing.innerHTML = ''

  const date = new Date()
  const hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours()
  const minutes =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes()
  const time = `${hours}:${minutes}`


  messages.insertAdjacentHTML(
    'beforeend',
    `
	  <li class="message-received">
    <p >${message}</p>
    <p class="time">${time}</p>
  </li>
	`
  )
  messages.scrollTop = messages.scrollHeight

}


function userTyping() {

  socket.on('typing', (data) => {
    typing.innerHTML = `${data} is typing...`
    setTimeout(() => {
      typing.innerHTML = ''
    }, 4000)
  })
  socket.emit('typing', username)

}