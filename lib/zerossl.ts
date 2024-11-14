// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

import forge from 'node-forge'
import {
  Certificate,
  CertificateList,
  CertificateRecord,
  CertificateSigningRequestOptions,
  CertificateSigningRequestValidationResult,
  CreateCertificateOptions,
  KeyPair,
  ListCertificateOptions,
  VerificationStatus,
  VerifyDomainOptions,
  ZeroSSLOptions
} from './types'
import { ZeroSSLError, findZeroSSLError } from './errors'
import superagent, { SuperAgentRequest } from 'superagent'

const defaultOptions = {
  apiUrl: 'https://api.zerossl.com'
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
      const error = findZeroSSLError(response.body.error?.code || 0)
      if (response.body.error?.details) error.details = response.body.error.details

      throw new ZeroSSLError(response.status, error)
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
    
    if (options.replacementForCertificate) postFn.field('replacement_for_certificate', options.replacementForCertificate as string)

    const result = await this.performRequest(postFn)
    return result.body as CertificateRecord
  }

  // Verify Domains
  public async verifyDomains(id: string, options: VerifyDomainOptions): Promise<CertificateRecord> {
    const isEmailValidation = options.validation_method === 'EMAIL'
    const missingEmail = isEmailValidation && !options.validation_email
    if (missingEmail) throw new Error('Missing verification option: validation_email')

    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/challenges?${qs}`

    let postFn = superagent.post(url)
      .type('form')
      .field('validation_method', options.validation_method)

    if (isEmailValidation) postFn = postFn.field('validation_email', options.validation_email as string)

    const result = await this.performRequest(postFn)
    return result.body as CertificateRecord
  }

  // Download Certificate (inline)
  public async downloadCertificate(id: string): Promise<Certificate> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/download/return?${qs}`
    const getFn = superagent.get(url)
    const result = await this.performRequest(getFn)

    return result.body as Certificate
  }

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

  // Verification Status
  public async verificationStatus(id: string): Promise<VerificationStatus> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/status?${qs}`
    const getFn = superagent.get(url)
    const result = await this.performRequest(getFn)

    return result.body as VerificationStatus
  }

  // Resend Verification
  public async resendVerification(id: string): Promise<boolean> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/challenges/email?${qs}`
    const postFn = superagent.post(url)
    const result = await this.performRequest(postFn)

    return result.body.success === 1
  }

  // Cancel Certificate
  public async cancelCertificate(id: string): Promise<boolean> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/cancel?${qs}`
    const postFn = superagent.post(url)
    const result = await this.performRequest(postFn)

    return result.body.success === 1
  }

  // Revoke Certificate
  public async revokeCertificate(id: string): Promise<boolean> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/certificates/${id}/revoke?${qs}`
    const postFn = superagent.post(url)
    const result = await this.performRequest(postFn)

    return result.body.success === 1
  }

  // Validate Certificate Signing Request
  public async validateCSR(csr: string): Promise<CertificateSigningRequestValidationResult> {
    const qs = this.queryString({ access_key: this.options.accessKey })
    const url = `${this.options.apiUrl}/validation/csr?${qs}`

    const postFn = superagent.post(url)
      .set('Content-Type', 'application/json')
      .send({ csr })

    const result = await this.performRequest(postFn)
    return result.body as CertificateSigningRequestValidationResult
  }

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
