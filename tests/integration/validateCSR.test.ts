// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

describe('Validate CSR', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  // Generate a keypair
  const keyPair = zerossl.generateKeyPair()
  expect(keyPair.publicKey).to.be.a('string')
  expect(keyPair.privateKey).to.be.a('string')

  it('should validate a good csr', async () => {
    // Generate a good CSR
    const csrOptions = {
      country: 'GB',
      state: 'England',
      locality: 'London',
      organization: 'Example Corp',
      organizationUnit: 'IT',
      email: 'admin@example.com',
      commonName: 'example.com'
    }
    const csr = zerossl.generateCSR(keyPair, csrOptions)
    expect(csr).to.be.a('string')

    // Validate good CSR
    const result = await zerossl.validateCSR(csr)
    expect(result.valid).to.equal(true)

    console.log('\nresult:\n', result)
  })

  it('should fail to validate a bad csr', async () => {
    // Generate a bad CSR
    const csrOptions = {
      country: 'GB',
      state: 'England',
      locality: 'London',
      organization: 'Example Corp',
      organizationUnit: 'IT',
      email: 'admin@example.com',
      commonName: ''
    }
    const csr = zerossl.generateCSR(keyPair, csrOptions)
    expect(csr).to.be.a('string')

    // Validate bad CSR
    const result = await zerossl.validateCSR(csr)
    expect(result.valid).to.equal(false)

    console.log('\nresult:\n', result)
  })
})
