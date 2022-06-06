const bcrypt = require('bcryptjs')
const cryptoJS = require('crypto-js')

const testBcrypt = () => {
	const password = 'hello_1234'
	// turn this password  into a hash
	// when a user sign up, we will hash their pass and store it in out db
	const salt = 12
	const hash = bcrypt.hashSync(password, salt)
	console.log(hash)

	// when a user logs in we can use compare sync to match passwrods to our db's hashes
	const compare = bcrypt.compareSync('wrong pass', hash)
	console.log('do they match?', compare)
}

// testBcrypt()

const testCrypto = () => {
	// this passphrase will be known only to the server admins
	const passphrase = 'gfssnudhfsn34'

	// this message will be in the cookie as the user's id
	const message = 'hello'

	const encrypted = cryptoJS.AES.encrypt(message, passphrase).toString()
	console.log(encrypted)
	// in the middle we will decrypt
	const decrypted = cryptoJS.AES.decrypt(encrypted, passphrase).toString(cryptoJS.enc.Utf8)
	console.log(decrypted)
}
testCrypto()