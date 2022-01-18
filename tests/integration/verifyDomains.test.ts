// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

describe('Verify Domains', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_API_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should verify a domain', async () => {
    // TODO
  })
})
