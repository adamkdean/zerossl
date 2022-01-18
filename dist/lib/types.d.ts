export declare type Certificate = {
    'certificate.crt': string;
    'ca_bundle.crt': string;
};
export declare type CertificateList = {
    total_count: number;
    result_count: number;
    page: number;
    limit: number;
    results: CertificateRecord[];
};
export declare type CertificateRecord = {
    id: string;
    type: string;
    common_name: string;
    additional_domains: string;
    created: string;
    expires: string;
    status: string;
    validation_type: string;
    validation_emails: string;
    replacement_for: string;
    validation: {
        email_validation: {
            [domain: string]: string[];
        };
        other_methods: {
            [domain: string]: {
                file_validation_url_http: string;
                file_validation_url_https: string;
                file_validation_content: string[];
                cname_validation_p1: string;
                cname_validation_p2: string;
            };
        };
    };
};
export declare type CertificateSigningRequestOptions = {
    country: string;
    state: string;
    locality: string;
    organization: string;
    organizationUnit: string;
    email?: string;
    commonName: string;
};
export declare type CertificateSigningRequestValidationResult = {
    valid: boolean;
    error?: ZeroSSLError;
};
export declare type CreateCertificateOptions = {
    csr: string;
    domains: string[];
    validityDays: 90 | 365;
    strictDomains: boolean;
};
export declare type KeyPair = {
    publicKey: string;
    privateKey: string;
};
export declare type ListCertificateOptions = {
    page?: number;
    limit?: number;
    search?: string;
    certificate_status?: 'draft' | 'pending_validation' | 'issued' | 'cancelled' | 'expiring_soon' | 'expire';
};
export declare type VerificationStatus = {
    validation_completed: number;
    details: {
        [domain: string]: {
            method: string;
            status: string;
        };
    };
};
export declare type VerifyDomainOptions = {
    validation_method: 'EMAIL' | 'CNAME_CSR_HASH' | 'HTTP_CSR_HASH' | 'HTTPS_CSR_HASH';
    validation_email?: string;
};
export declare type ZeroSSLOptions = {
    accessKey: string;
    apiUrl?: string;
};
export declare type ZeroSSLError = {
    code?: number;
    type?: string;
    message?: string;
    details?: {
        [domain: string]: {
            [domain: string]: {
                cname_found: number;
                record_correct: number;
                target_host: string;
                target_record: string;
                actual_record: string;
            };
        };
    };
};
