// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

describe('Get Certificate', () => {
  let zerossl: ZeroSSL

  before(function () {
    dotenv.config()
    this.timeout(30000)

    // Initialize ZeroSSL
    const accessKey = process.env.ZEROSSL_API_KEY || ''
    zerossl = new ZeroSSL({ accessKey })
    expect(zerossl.options.apiUrl).to.equal('api.zerossl.com')
    expect(zerossl.options.accessKey).to.equal(accessKey)
  })

  it('should get a certificate', async () => {
    const certificateId = '7e75f492203f27fdffe000854a386f84'

    // Get a certificate
    const certificate = await zerossl.getCertificate(certificateId)

    // Check the certificate
    expect(certificate.id).to.be.a('string')
    expect(certificate.id).to.equal(certificateId)

    console.log('\ncertificate:\n', certificate)
  })
})
