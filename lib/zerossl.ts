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
  ZeroSSLOptions,
  StatusResponse
} from './types'
import { ZeroSSLError, findZeroSSLError } from './errors'

const defaultOptions = {
  apiUrl: 'api.zerossl.com'
}

export class ZeroSSL {
  public options: ZeroSSLOptions

  constructor(options: ZeroSSLOptions) {
    this.options = { ...defaultOptions, ...options }
  }

  private async performRequest<T>(url: string, request: RequestInit): Promise<T> {
    if (request.method === "POST") {
      request.headers ??= { "content-type": "application/x-www-form-urlencoded"}
    }
    const response = await fetch("https://" + url, request);
    const body = await response.json();
    if (!response.ok || body.success === false) {
      const error = findZeroSSLError(body.error?.code || 0)
      if (body.error?.details) error.details = body.error.details

      throw new ZeroSSLError(response.status, error)
    }
    return body
  }

  // Create Certificate
  public async createCertificate(options: CreateCertificateOptions): Promise<CertificateRecord> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates?${qs}`

    return await this.performRequest<CertificateRecord>(url, {
      method: "POST",
      body: new URLSearchParams({
        certificate_domains: options.domains.join(','),
        certificate_csr: options.csr,
        certificate_validity_days: options.validityDays.toString(10),
        strict_domains: options.strictDomains.toString()
      }).toString()
    })
  }

  // Verify Domains
  public async verifyDomains(id: string, options: VerifyDomainOptions): Promise<CertificateRecord> {
    const isEmailValidation = options.validation_method === 'EMAIL'
    const missingEmail = isEmailValidation && !options.validation_email
    if (missingEmail) throw new Error('Missing verification option: validation_email')
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()

    const url = `${this.options.apiUrl}/certificates/${id}/challenges?${qs}`

    const params = new URLSearchParams({validation_method: options.validation_method})

    if (isEmailValidation) params.set('validation_email', options.validation_email as string)

    return await this.performRequest<CertificateRecord>(url, {
      method: "POST",
      body: params.toString()
    })
  }

  // Download Certificate (inline)
  public async downloadCertificate(id: string): Promise<Certificate> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}/download/return?${qs}`
    return await this.performRequest<Certificate>(url, {})
  }

  // Get Certificate
  public async getCertificate(id: string): Promise<CertificateRecord> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}?${qs}`
    return await this.performRequest<CertificateRecord>(url, {})
  }

  // List Certificates
  public async listCertificates(options?: ListCertificateOptions): Promise<CertificateList> {
    const query: Record<string, string> = { access_key: this.options.accessKey }
    if (options) {
      if (options.page) query['page'] = options.page.toString()
      if (options.limit) query['limit'] = options.limit.toString()
      if (options.search) query['search'] = options.search
      if (options.certificate_status) query['certificate_status'] = options.certificate_status
    }

    const qs = new URLSearchParams(query).toString()
    const url = `${this.options.apiUrl}/certificates?${qs}`
    return await this.performRequest<CertificateList>(url, {})
  }

  // Verification Status
  public async verificationStatus(id: string): Promise<VerificationStatus> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}/status?${qs}`
    return await this.performRequest<VerificationStatus>(url, {})
  }

  // Resend Verification
  public async resendVerification(id: string): Promise<boolean> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}/challenges/email?${qs}`
    const result = await this.performRequest<StatusResponse>(url, {
      method: "POST",      
    })

    return result.success === 1
  }

  // Cancel Certificate
  public async cancelCertificate(id: string): Promise<boolean> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}/cancel?${qs}`
    const result = await this.performRequest<StatusResponse>(url, {
      method: "POST"
    })

    return result.success === 1
  }

  // Revoke Certificate
  public async revokeCertificate(id: string): Promise<boolean> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/certificates/${id}/revoke?${qs}`
    const result = await this.performRequest<StatusResponse>(url, {
      method: "POST"
    })

    return result.success === 1
  }

  // Validate Certificate Signing Request
  public async validateCSR(csr: string): Promise<CertificateSigningRequestValidationResult> {
    const qs = new URLSearchParams({ access_key: this.options.accessKey }).toString()
    const url = `${this.options.apiUrl}/validation/csr?${qs}`

    return await this.performRequest<CertificateSigningRequestValidationResult>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({csr})
    })
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
