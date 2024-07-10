// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const certificateId = ''

describe('Download Certificate', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should download a certificate', async () => {
    const certificate = await zerossl.getCertificate(certificateId)
    console.log('\ncertificate:\n', certificate)

    expect(certificate.status).to.equal('issued')
    if (certificate.status !== 'issued') {
      console.error('certificate has not been issued, cannot download certificate files')
      return
    }

    const certFiles = await zerossl.downloadCertificate(certificateId)
    console.log('\ncertFiles:\n', certFiles)

    expect(certFiles['ca_bundle.crt']).to.be.a('string')
    expect(certFiles['ca_bundle.crt']).to.have.length.above(0)
    expect(certFiles['certificate.crt']).to.be.a('string')
    expect(certFiles['certificate.crt']).to.have.length.above(0)
  })
})
