import { Certificate, CertificateList, CertificateRecord, CertificateSigningRequestOptions, CertificateSigningRequestValidationResult, CreateCertificateOptions, KeyPair, ListCertificateOptions, VerificationStatus, VerifyDomainOptions, ZeroSSLOptions } from './types';
export declare class ZeroSSL {
    options: ZeroSSLOptions;
    constructor(options: ZeroSSLOptions);
    private queryString;
    private performRequest;
    createCertificate(options: CreateCertificateOptions): Promise<CertificateRecord>;
    verifyDomains(id: string, options: VerifyDomainOptions): Promise<unknown>;
    downloadCertificate(id: string): Promise<Certificate>;
    getCertificate(id: string): Promise<CertificateRecord>;
    listCertificates(options?: ListCertificateOptions): Promise<CertificateList>;
    verificationStatus(id: string): Promise<VerificationStatus>;
    resendVerification(id: string): Promise<boolean>;
    cancelCertificate(id: string): Promise<boolean>;
    deleteCertificate(id: string): Promise<boolean>;
    validateCSR(csr: string): Promise<CertificateSigningRequestValidationResult>;
    generateKeyPair(bits?: number): KeyPair;
    generateCSR(keypair: KeyPair, options: CertificateSigningRequestOptions): string;
}
