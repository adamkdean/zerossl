// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import { expect } from 'chai'

describe('ZeroSSL', () => {
  before(() => {
    //
  })

  describe('Constructor', () => {
    it('should set default apiUrl option', () => {
      const options = { accessKey: 'testing' }
      const zerossl = new ZeroSSL(options)
      expect(zerossl.options.apiUrl).to.equal('https://api.zerossl.com')
    })

    it('should set apiUrl option', () => {
      const options = { accessKey: 'testing', apiUrl: 'testing.com' }
      const zerossl = new ZeroSSL(options)
      expect(zerossl.options.apiUrl).to.equal(options.apiUrl)
    })

    it('should set accessKey option', () => {
      const options = { accessKey: 'testing' }
      const zerossl = new ZeroSSL(options)
      expect(zerossl.options.accessKey).to.equal(options.accessKey)
    })
  })

  describe('Generate key pair', () => {
    it('should generate a key pair', () => {
      const zerossl = new ZeroSSL({ accessKey: 'testing' })
      const keyPair = zerossl.generateKeyPair()
      expect(keyPair.publicKey).to.be.a('string')
      expect(keyPair.privateKey).to.be.a('string')
    })
  })

  describe('Generate certificate signing request', () => {
    it('should generate a certificate signing request', () => {
      const zerossl = new ZeroSSL({ accessKey: 'testing' })
      const keyPair = zerossl.generateKeyPair()
      const options = {
        country: 'GB',
        state: 'England',
        locality: 'London',
        organization: 'Example Corp',
        organizationUnit: 'IT',
        email: 'admin@example.com',
        commonName: 'example.com'
      }
      const csr = zerossl.generateCSR(keyPair, options)
      expect(csr).to.be.a('string')
    })
  })
})
