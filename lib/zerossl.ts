// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import { ZeroSSLErrorMap } from './errors'
import forge from 'node-forge'
import {
  CertificateList,
  CertificateRecord,
  CertificateSigningRequestOptions,
  CreateCertificateOptions,
  KeyPair,
  ListCertificateOptions,
  ZeroSSLOptions
} from './types'
import superagent, { SuperAgentRequest } from 'superagent'

const defaultOptions = {
  apiUrl: 'api.zerossl.com'
}

export class ZeroSSL {
  public options: ZeroSSLOptions

  constructor(options: ZeroSSLOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  private queryString(params: { [key: string]: string | number }): string {
    return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
  }

  private async performRequest(request: SuperAgentRequest): Promise<superagent.Response> {
    const response = await request
    if (response.status !== 200 || response.body.success === false) {
      console.log(response.body)
      const errorCode = response.body.error.code || 0
      const error = ZeroSSLErrorMap[errorCode]
      throw new Error(`${error.code} (${error.type}) ${error.message}`)
    }
    return response
  }

  // Create Certificate
  public async createCertificate(options: CreateCertificateOptions): Promise<CertificateRecord> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates?${qs}`

    const postFn = superagent.post(url)
      .type('form')
      .field('certificate_domains', options.domains.join(','))
      .field('certificate_csr', options.csr)
      .field('certificate_validity_days', options.validityDays)
      .field('strict_domains', options.strictDomains)

    const result = await this.performRequest(postFn)
    return result.body as CertificateRecord
  }

  // // Verify Domains
  // public async verifyDomains(): Promise<void> {
  //   // TODO: api.zerossl.com/certificates/{id}/challenges
  // }

  // // Download Certificate (ZIP)
  // // Download Certificate (inline)
  // public async downloadCertificate(id: string): Promise<void> {
  //   // TODO: api.zerossl.com/certificates/{id}/download
  //   //       api.zerossl.com/certificates/{id}/download/return
  // }

  // Get Certificate
  public async getCertificate(id: string): Promise<CertificateRecord> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}?${qs}`
    const getFn = superagent.get(url)
    const result = await this.performRequest(getFn)

    return result.body as CertificateRecord
  }

  // List Certificates
  public async listCertificates(options?: ListCertificateOptions): Promise<CertificateList> {
    const query: Record<string, string | number> = { access_key: this.options.accessKey }
    if (options) {
      if (options.page) query['page'] = options.page
      if (options.limit) query['limit'] = options.limit
      if (options.search) query['search'] = options.search
      if (options.certificate_status) query['certificate_status'] = options.certificate_status
    }

    const qs = this.queryString(query)
    const url = `${this.options.apiUrl}/certificates?${qs}`
    const getFn = superagent.get(url)
    const result = await this.performRequest(getFn)

    return result.body as CertificateList
  }

  // // Verification Status
  // public async verificationStatus(id: string): Promise<void> {
  //   // TODO: api.zerossl.com/certificates/{id}/status
  // }

  // // Resend Verification
  // public async resendVerification(id: string): Promise<void> {
  //   // TODO: api.zerossl.com/certificates/{id}/challenges/email
  // }

  // Cancel Certificate
  public async cancelCertificate(id: string): Promise<boolean> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/cancel?${qs}`
    const postFn = superagent.post(url)
    const result = await this.performRequest(postFn)

    return result.body.success === 1
  }

  // // Delete Certificate
  // public async deleteCertificate(id: string): Promise<void> {
  //   // TODO: api.zerossl.com/certificates/{id}
  // }

  // // Validate Certificate Signing Request
  // public async validateCSR(csr: string): Promise<void> {
  //   // TODO: api.zerossl.com/validation/csr
  // }

  // Generate Key Pair
  public generateKeyPair(bits = 2048): KeyPair {
    const keys = forge.pki.rsa.generateKeyPair(bits)
    return {
      publicKey: forge.pki.publicKeyToPem(keys.publicKey),
      privateKey: forge.pki.privateKeyToPem(keys.privateKey)
    }
  }

  // Generate Certificate Signing Request
  public generateCSR(keypair: KeyPair, options: CertificateSigningRequestOptions): string {
    const { country, state, locality, organization, organizationUnit, commonName, email } = options
    const csr = forge.pki.createCertificationRequest()
    csr.publicKey = forge.pki.publicKeyFromPem(keypair.publicKey)
    csr.setSubject([
      { name: 'countryName', value: country },
      { name: 'stateOrProvinceName', value: state },
      { name: 'localityName', value: locality},
      { name: 'organizationName', value: organization },
      { name: 'organizationalUnitName', value: organizationUnit },
      { name: 'commonName', value: commonName },
      { name: 'emailAddress', value: email }
    ])
    csr.sign(forge.pki.privateKeyFromPem(keypair.privateKey))
    return forge.pki.certificationRequestToPem(csr)
  }
}
