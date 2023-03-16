const fetch = require('isomorphic-fetch')
const fs = require('fs')

async function main () {
  const addresses = fs.readFileSync('addresses.txt').toString().split('\n').filter(x => x).map(x => x.trim().toLowerCase())
  const output = []
  let total = 0
  for (let address of addresses) {
    address = address.trim().toLowerCase()
    if (!address) {
      continue
    }
    const url = `https://arbitrum.foundation/_next/data/NDhqybgYBJYIbHFAh1PQB/eligibility.json?address=${address}`
    const res = await fetch(url)
    const json = await res.json()
    if (res.status === 200) {
      console.log(json)
      const amount = json.pageProps.isEligible ? json.pageProps.eligibility.tokens : 0
      total += amount
      output.push(`${address} ${amount.toString()} ARB`)
    } else {
      output.push(`${address} 0`)
    }
  }
  output.push(`total ${total.toString()} ARB`)
  console.log(output.join('\n'))
}

main().catch(console.error)
