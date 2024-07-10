// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { CertificateRecord } from '../../lib/types'
import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const commonName = 'example.com'
const emailAddress = 'email@example.com'

describe('Full Test', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  let certificate: CertificateRecord

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
    certificate = await zerossl.createCertificate({
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
  })

  it('should verify the domain', async () => {
    console.log(`Verifying ${commonName} (${certificate.id})...`)
    const result = await zerossl.verifyDomains(certificate.id, { validation_method: 'HTTP_CSR_HASH' })
    console.log(result)

    // "If the verification of your CNAME-records or uploaded files was successful, the ZeroSSL API will return
    //  your entire certificate object with status pending_validation. From this moment it will take just a few
    //  seconds (in some cases, up to 5-10 minutes) for our system to validate and issue your certificate. As soon
    //  as your certificate has been issued, the certificate status will change  to issued automatically."

    // Our system is currently issuing your certificate. This page will refresh automatically every few seconds.

    // console.log('sleeping for 5 seconds...')
    // await new Promise(resolve => setTimeout(resolve, 5000))
  })

  // it('should download the certificate', async () => {
  //   console.log(`Downloading ${commonName} (${certificate.id}) certificate...`)
  //   const result = await zerossl.getCertificate(certificate.id)
  //   console.log(result)

  //   expect(result.status).to.equal('valid')
  //   if (result.status !== 'valid') {
  //     console.error('certificate is not valid, cannot download certificate files')
  //     return
  //   }

  //   const certFiles = await zerossl.downloadCertificate(certificate.id)
  //   console.log('\ncertFiles:\n', certFiles)

  //   expect(certFiles['ca_bundle.crt']).to.be.a('string')
  //   expect(certFiles['ca_bundle.crt']).to.have.length.above(0)
  //   expect(certFiles['certificate.crt']).to.be.a('string')
  //   expect(certFiles['certificate.crt']).to.have.length.above(0)
  // })
})
