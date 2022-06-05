const socket = io()
const messages = document.querySelector('section ul')
const input = document.querySelector('input')
const form = document.querySelector('form')
const username = prompt('What is your name?')
const USERNAME_MIN_LENGTH = 3


while (username === null || username.length < USERNAME_MIN_LENGTH) {
  username = prompt(
    `Username must be longer than ${USERNAME_MIN_LENGTH} characters`
  )
}


newUser('You joined')
socket.emit('new-user', username)

form.addEventListener('submit', submitMessage)

function submitMessage(event) {
  event.preventDefault()
  const message = input.value
  if (input.value === '') return
  appendMessage(`Jij <br> ${message}`)
  socket.emit('send-message', message)
  input.value = ''
}

socket.on('send-message', message => {

  appendMessage(`${message.username} <br> ${message.message}`)
})

socket.on('user-connected', username => {
  newUser(`${username} connected`)
})


socket.on('user-disconnected', username => {
  newUser(`${username} disconnected`)
})


function appendMessage(message) {

  const date = new Date()
  const hours = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours()
  const minutes =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes()
  const time = `${hours}:${minutes}`


  // const user = message.username

  // const messageElement = document.createElement('li')
  // messageElement.innerText = message
  // messages.append(messageElement)


  // const messageTimeElement = document.createElement('p')
  // messageTimeElement.innerText = time
  // messages.append(messageTimeElement)







  messages.insertAdjacentHTML(
		'beforeend',
		`
	  <li class="message">
    <p>${message}</p>
    <span>${time}</span>
  </li>
	`
	)









  messages.scrollTop = messages.scrollHeight


}




function newUser(message) {



  // const messageElement = document.createElement('p')
  // messageElement.innerText = message
  // messages.append(messageElement)

  messages.insertAdjacentHTML(
		'beforeend',
		`
	  <p class="user-info">${message}</p>
	`
	)




  messages.scrollTop = messages.scrollHeight


}