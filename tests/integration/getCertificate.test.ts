// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const certificateId = ''

describe('Get Certificate', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should get a certificate', async () => {
    // Get a certificate
    const certificate = await zerossl.getCertificate(certificateId)

    // Check the certificate
    expect(certificate.id).to.be.a('string')
    expect(certificate.id).to.equal(certificateId)

    console.log('\ncertificate:\n', certificate)
    console.log(certificate.validation)
  })
})
