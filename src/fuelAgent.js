const Web3 = require('web3')
const ethers = require('ethers')
const Transaction = require('ethereumjs-tx')

const config = require('../config.json')

function fuelService() {
  this.web3 = new Web3(config.endpoint)
  this.myWallet = ethers.Wallet.fromMnemonic(config.seedPhrase)
}

fuelService.prototype.getBalance = function() {
  return this.web3.eth.getBalance(this.myWallet.address).then(amount => {
    return this.web3.utils.fromWei(amount, 'ether')
  })
}

fuelService.prototype.sendEther = function(address) {
  const value = this.web3.utils.toHex(this.web3.utils.toWei(config.amount, 'ether'))

  return this.web3.eth.getTransactionCount(this.myWallet.address).then(nonce => {
    const tx = new Transaction({
      nonce: nonce,
      value: value,
      gasLimit: config.gasLimit,
      gasPrice: config.gasPrice,
      to: address
    })

    tx.sign(Buffer.from(this.myWallet.privateKey.slice(2), 'hex'))
    const serializedTx = tx.serialize()

    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('confirmation', () => {
          return resolve('DONE')
        })
        .on('error', (err) => {
          return reject(err)
        })
    })
  })
}

module.exports = fuelService