// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSL } from '../../lib'
import dotenv from 'dotenv'
import { expect } from 'chai'

describe.only('List Certificates', function () {
  dotenv.config()
  this.timeout(30000)

  // Initialize ZeroSSL
  const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
  const zerossl = new ZeroSSL({ accessKey })
  expect(zerossl.options.apiUrl).to.equal('api.zerossl.com')
  expect(zerossl.options.accessKey).to.equal(accessKey)

  it('should get all certificate', async () => {
    const certificates = await zerossl.listCertificates()

    expect(certificates).to.have.property('total_count')
    expect(certificates).to.have.property('result_count')
    expect(certificates).to.have.property('page')
    expect(certificates).to.have.property('limit')
    expect(certificates).to.have.property('results')

    certificates.results.forEach(certificate => {
      expect(certificate).to.be.a('object')
      expect(certificate.id).to.be.a('string')
      console.log(certificate.id, certificate.status, certificate.common_name)
    })

    console.log(`page ${certificates.page} of ${certificates.total_count}`)
  })

  it('should get cancelled certificates only', async () => {
    const certificates = await zerossl.listCertificates({ certificate_status: 'cancelled' })

    expect(certificates).to.have.property('total_count')
    expect(certificates).to.have.property('result_count')
    expect(certificates).to.have.property('page')
    expect(certificates).to.have.property('limit')
    expect(certificates).to.have.property('results')

    certificates.results.forEach(certificate => {
      expect(certificate).to.be.a('object')
      expect(certificate.id).to.be.a('string')
      expect(certificate.status).to.equal('cancelled')
      console.log(certificate.id, certificate.status, certificate.common_name)
    })

    console.log(`page ${certificates.page} of ${certificates.total_count}`)
  })
})
