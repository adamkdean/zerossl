// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const certificateId = ''

describe('Cancel Certificate', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should cancel a certificate', async () => {
    // Cancel the certificate
    const success = await zerossl.cancelCertificate(certificateId)
    expect(success).to.equal(true)

    // Delete the certificate
    // const success = await zerossl.deleteCertificate(certificate.id)
    // expect(success).to.equal(true)
  })
})
