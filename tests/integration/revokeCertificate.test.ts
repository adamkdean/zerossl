// Copyright 2022 Alisson Acioli <alissonacioli@hotmail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const certificateId = ''

describe('Revoke Certificate', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should revoke a certificate', async () => {
    // Revoke the certificate
    const success = await zerossl.revokeCertificate(certificateId)
    expect(success).to.equal(true)

    // Revoke the certificate
    // const success = await zerossl.revokeCertificate(certificate.id)
    // expect(success).to.equal(true)
  })
})
