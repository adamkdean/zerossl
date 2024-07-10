// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const commonName = 'example.com'
const emailAddress = 'email@example.com'

describe('Create Certificate', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should create a certificate', async () => {
    // Generate a keypair
    const keyPair = zerossl.generateKeyPair()
    expect(keyPair.publicKey).to.be.a('string')
    expect(keyPair.privateKey).to.be.a('string')

    // Generate a CSR
    const csrOptions = {
      country: 'GB',
      state: 'England',
      locality: 'London',
      organization: '',
      organizationUnit: '',
      email: emailAddress,
      commonName: commonName
    }
    const csr = zerossl.generateCSR(keyPair, csrOptions)
    expect(csr).to.be.a('string')

    // Create a certificate
    const certificate = await zerossl.createCertificate({
      csr: csr,
      domains: [commonName],
      validityDays: 90,
      strictDomains: true
    })

    // Check the certificate
    expect(certificate.id).to.be.a('string')
    expect(certificate.status).to.equal('draft')

    console.log('\nkey:\n', keyPair.privateKey)
    console.log('\ncsr:\n', csr)
    console.log('\ncertificate:\n', certificate)

    // Cancel the certificate
    // const success = await zerossl.cancelCertificate(certificate.id)
    // expect(success).to.equal(true)

    // Delete the certificate
    // const success = await zerossl.deleteCertificate(certificate.id)
    // expect(success).to.equal(true)
  })
})
