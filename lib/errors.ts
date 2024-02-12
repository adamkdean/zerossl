// Copyright 2022 Adam K Dean <adamkdean@googlemail.com>
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

/* eslint-disable max-len */

// Errors are sourced from https://zerossl.com/documentation/api/error-codes/
// Correct as of 14 January 2022
//
// Error Code / Type  Description
//
// 0 domain_control_validation_failed (No message, undocumented error)
// 101 invalid_access_key  User has provided an invalid API access key.
// 103 invalid_api_function  User has provided an invalid API function.
// 2800 incorrect_request_type  User has made a non-supported API request.
// 2801 permission_denied  User does not have the permissions to access this resource.
// 2802 missing_certificate_hash  User has not provided a certificate ID (hash).
// 2803 certificate_not_found  The given certificate ID (hash) could not be found.
// 2804 cannot_issue_certificate_unpaid_upgrade_invoices  The current certificate cannot be issued due to unpaid invoices on user account.
// 2805 invalid_certificate_type  User has provided an invalid certificate type.
// 2806 missing_certificate_type  User has not provided a valid certificate type.
// 2807 invalid_certificate_validity  User has not provided a valid certificate validity.
// 2808 invalid_certificate_domain  User has not provided one or more invalid certificate domains.
// 2809 wildcard_domains_not_allowed_in_multidomain_certificate  Wildcards cannot be included in multi-domain certificates.
// 2810 invalid_domains_in_multidomain_request  User has not provided one or more invalid domains in multi-domain request.
// 2811 duplicate_domains_in_array  User has not provided one or more duplicate domains.
// 2812 missing_certificate_domains  User has not provided any certificate domains.
// 2813 cannot_replace_certificate_other_replacement_in_draft  Only issued certificates can be renewed or replaced by a new certificate.
// 2814 permission_denied_on_original_certificate  User does not have the permissions to access certificate to renew.
// 2815 original_certificate_not_active  Only issued certificates can be renewed or replaced by a new certificate.
// 2816 cannot_find_original_certificate  Certificate to renew was not found.
// 2817 certificate_limit_reached  Limit of certificates on user account was reached.
// 2818 invalid_certificate_csr  User has not provided a valid CSR value.
// 2819 missing_certificate_csr  User has not provided a CSR value.
// 2820 internal_error_failed_processing_csr  Internal error processing CSR. Please contact support if this error occurs.
// 2821 internal_error_failed_creating_certificate  Internal error generating certificate. Please contact support if this error occurs.
// 2839 duplicate_certificates_found  Domain can no longer be protected using Free Plan, upgrade to Basic Plan required.
// 2822 failed_showing_certificate  The requested certificate could not be retrieved.
// 2823 failed_validating_certificate  Domain verification failed and must be retried.
// 2824 missing_validation_emails  User has not provided a validation email for each domain in certificate.
// 2825 missing_validation_email  User has not provided a validation email for each domain in certificate.
// 2826 internal_error_while_valdating_domain_control  Internal error verifying domains. Please contact support if this error occurs.
// 2827 invalid_validation_method  User has provided an in invalid domain verification method.
// 2828 missing_validation_method  User has not provided a domain verification method.
// 2829 incorrect_certificate_validation_type  User has provided an in invalid domain verification method or value.
// 2830 certificate_not_eligible  The given certificate is not eligible for domain verification.
// 2831 certificate_not_ready_to_validate  The given certificate is not ready for domain verification.
// 2840 invalid_caa_records_detected  Invalid CAA records detected for some domains. Array of affected domains can be found in details object. Learn more about CAA records.
// 2832 certificate_not_issued  The given certificate has not been issued yet.
// 2833 certificate_cannot_be_cancelled  The given certificate cannot be cancelled due to its status.
// 2834 failed_cancelling_certificate  Internal error cancelling certificate. Try again or contact support.
// 2835 certificate_cannot_be_deleted  The given certificate cannot be deleted due to its status.
// 2836 failed_deleting_certificate  Internal error deleting certificate. Try again or contact support.
// 2837 failed_resending_email  Internal error resending verification email. Try again or contact support.
// 2838 failed_getting_validation_status  Error retrieveing domain verification status. Try again and make sure Email Verification is selected.

import { ZeroSSLErrorData } from './types'

export class ZeroSSLError extends Error {
  public code
  public details
  public status
  public type

  constructor(status: number, data: ZeroSSLErrorData) {
    super(data.message)
    this.name = 'ZeroSSLError'
    this.status = status
    this.code = data.code
    this.details = data.details
    this.type = data.type
  }
}

export const ZeroSSLErrorMap: { [key: number]: ZeroSSLErrorData } = {
  //
  // Errors - Undocumented
  0: {
    code: 0,
    type: 'domain_control_validation_failed',
    message: ''
  },

  // 2835 is a new error when trying to use delete endpoint (currently removed)
  2835: {
    code: 2835,
    type: 'certificate_cannot_be_deleted',
    message: 'This endpoint has been removed. There is no valid reason to delete a certificate - instead they should be expired, revoked or cancelled'
  },

  //
  // Errors - General
  //
  101: {
    code: 101,
    type: 'invalid_access_key',
    message: 'User has provided an invalid API access key.'
  },
  103: {
    code: 103,
    type: 'invalid_api_function',
    message: 'User has provided an invalid API function.'
  },
  110: {
    code: 110,
    type: 'invalid_request_body',
    message: 'The body of your request was wrong. Please check your request arguments.'
  },
  111: {
    code: 111,
    type: 'internal_server_error',
    message: 'Something went wrong. If the problem persists please contact our support team (support@zerossl.com).'
  },
  2800: {
    code: 2800,
    type: 'incorrect_request_type',
    message: 'User has made a non-supported API request.'
  },
  2801: {
    code: 2801,
    type: 'permission_denied',
    message: 'User does not have the permissions to access this resource.'
  },
  2802: {
    code: 2802,
    type: 'missing_certificate_hash',
    message: 'User has not provided a certificate ID (hash).'
  },
  2803: {
    code: 2803,
    type: 'certificate_not_found',
    message: 'The given certificate ID (hash) could not be found.'
  },

  //
  // Errors - Create Certiticate:
  //
  2804: {
    code: 2804,
    type: 'cannot_issue_certificate_unpaid_upgrade_invoices',
    message: 'The current certificate cannot be issued due to unpaid invoices on user account.'
  },
  2805: {
    code: 2805,
    type: 'invalid_certificate_type',
    message: 'User has provided an invalid certificate type.'
  },
  2806: {
    code: 2806,
    type: 'missing_certificate_type',
    message: 'User has not provided a valid certificate type.'
  },
  2807: {
    code: 2807,
    type: 'invalid_certificate_validity',
    message: 'User has not provided a valid certificate validity.'
  },
  2808: {
    code: 2808,
    type: 'invalid_certificate_domain',
    message: 'User has not provided one or more invalid certificate domains.'
  },
  2809: {
    code: 2809,
    type: 'wildcard_domains_not_allowed_in_multidomain_certificate',
    message: 'Wildcards cannot be included in multi-domain certificates.'
  },
  2810: {
    code: 2810,
    type: 'invalid_domains_in_multidomain_request',
    message: 'User has not provided one or more invalid domains in multi-domain request.'
  },
  2811: {
    code: 2811,
    type: 'duplicate_domains_in_array',
    message: 'User has not provided one or more duplicate domains.'
  },
  2812: {
    code: 2812,
    type: 'missing_certificate_domains',
    message: 'User has not provided any certificate domains.'
  },
  2813: {
    code: 2813,
    type: 'cannot_replace_certificate_other_replacement_in_draft',
    message: 'Only issued certificates can be renewed or replaced by a new certificate.'
  },
  2814: {
    code: 2814,
    type: 'permission_denied_on_original_certificate',
    message: 'User does not have the permissions to access certificate to renew.'
  },
  2815: {
    code: 2815,
    type: 'original_certificate_not_active',
    message: 'Only issued certificates can be renewed or replaced by a new certificate.'
  },
  2816: {
    code: 2816,
    type: 'cannot_find_original_certificate',
    message: 'Certificate to renew was not found.'
  },
  2817: {
    code: 2817,
    type: 'certificate_limit_reached',
    message: 'Limit of certificates on user account was reached.'
  },
  2818: {
    code: 2818,
    type: 'invalid_certificate_csr',
    message: 'User has not provided a valid CSR value.'
  },
  2819: {
    code: 2819,
    type: 'missing_certificate_csr',
    message: 'User has not provided a CSR value.'
  },
  2820: {
    code: 2820,
    type: 'internal_error_failed_processing_csr',
    message: 'Internal error processing CSR. Please contact support if this error occurs.'
  },
  2821: {
    code: 2821,
    type: 'internal_error_failed_creating_certificate',
    message: 'Internal error generating certificate. Please contact support if this error occurs.'
  },
  2839: {
    code: 2839,
    type: 'duplicate_certificates_found',
    message: 'Domain can no longer be protected using Free Plan, upgrade to Basic Plan required.'
  },
  2841: {
    code: 2841,
    type: 'certificate_creation_locked_unpaid_invoices',
    message: 'Your account has been temporarily suspended due to unpaid invoices. Please pay your open invoices in order to unlock this endpoint.'
  },

  //
  // Errors - Verify Domains
  //
  2822: {
    code: 2822,
    type: 'failed_showing_certificate',
    message: 'The requested certificate could not be retrieved.'
  },
  2823: {
    code: 2823,
    type: 'failed_validating_certificate',
    message: 'Domain verification failed and must be retried. (restricted TLD, domain name is too long or CSR compromised)'
  },
  2824: {
    code: 2824,
    type: 'missing_validation_emails',
    message: 'User has not provided a validation email for each domain in certificate.'
  },
  2825: {
    code: 2825,
    type: 'missing_validation_email',
    message: 'User has not provided a validation email for each domain in certificate.'
  },
  2826: {
    code: 2826,
    type: 'internal_error_while_valdating_domain_control',
    message: 'Internal error verifying domains. Please contact support if this error occurs.'
  },
  2827: {
    code: 2827,
    type: 'invalid_validation_method',
    message: 'User has provided an in invalid domain verification method.'
  },
  2828: {
    code: 2828,
    type: 'missing_validation_method',
    message: 'User has not provided a domain verification method.'
  },
  2829: {
    code: 2829,
    type: 'incorrect_certificate_validation_type',
    message: 'User has provided an in invalid domain verification method or value.'
  },
  2830: {
    code: 2830,
    type: 'certificate_not_eligible',
    message: 'The given certificate is not eligible for domain verification.'
  },
  2831: {
    code: 2831,
    type: 'certificate_not_ready_to_validate',
    message: 'The given certificate is not ready for domain verification.'
  },
  2840: {
    code: 2840,
    type: 'invalid_caa_records_detected',
    message: 'Invalid CAA records detected for some domains. Array of affected domains can be found in details object. Learn more about CAA records.'
  },

  //
  // Errors - Download Certiticate
  //
  2832: {
    code: 2832,
    type: 'certificate_not_issued',
    message: 'The given certificate has not been issued yet.'
  },
  2860: {
    code: 2860,
    type: 'certificate_not_downloadable',
    message: 'The certificate can currently not be downloaded.'
  },

  //
  // Errors - Revoke Certiticate
  //
  2906: {
    code: 2906,
    type: 'revocation_failed',
    message: 'The certificate can not be revoked currently, please try again later. If the problem persists - especially in urgent cases like key compromise - please contact our support team (support@zerossl.com).'
  },

  //
  // Errors - Cancel Certiticate
  //
  2833: {
    code: 2833,
    type: 'certificate_cannot_be_cancelled',
    message: 'The given certificate cannot be cancelled due to its status.'
  },
  2834: {
    code: 2834,
    type: 'failed_cancelling_certificate',
    message: 'Internal error cancelling certificate. Try again or contact support.'
  },

  //
  // Errors - Resend Verification
  //
  2837: {
    code: 2837,
    type: 'failed_resending_email',
    message: 'Internal error resending verification email. Try again or contact support.'
  },

  //
  // Errors - Get Verification Status
  //
  2838: {
    code: 2838,
    type: 'failed_getting_validation_status',
    message: 'Error retrieveing domain verification status. Try again and make sure Email Verification is selected.'
  }
}

/**
 * Find a ZeroSSL error by code.
 * Returns a copy of the error, or if it is not found, an empty object.
 */
export function findZeroSSLError(code: number): ZeroSSLErrorData {
  if (ZeroSSLErrorMap[code] !== undefined) {
    return { ...ZeroSSLErrorMap[code] }
  }
  return {}
}
