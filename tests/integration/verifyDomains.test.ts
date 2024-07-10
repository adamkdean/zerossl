// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

const certificateId = ''

describe('Verify Domains', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should verify a domain', async () => {
    const certificate = await zerossl.getCertificate(certificateId)

    console.log('\ncertificate:\n', certificate)
    console.log(certificate.validation)

    const result: any = await zerossl.verifyDomains(certificateId, { validation_method: 'HTTP_CSR_HASH' })
    console.log(result)

    expect(result.error).to.equal(undefined)
    expect(result.status).to.equal('pending_validation')

    const certificateNow = await zerossl.getCertificate(certificateId)
    console.log('\ncertificate now:\n', certificateNow)
  })
})
