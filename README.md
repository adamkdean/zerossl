# ZeroSSL

ZeroSSL REST API wrapper based on the [ZeroSSL REST API documentation](https://zerossl.com/documentation/api/).

![TypeScript](https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=FFF) [![github stars](https://img.shields.io/github/stars/adamkdean/zerossl)](https://github.com/adamkdean/zerossl) [![npm version](https://img.shields.io/npm/v/zerossl)](https://www.npmjs.com/package/zerossl) [![npm downloads](https://img.shields.io/npm/dt/zerossl)](https://www.npmjs.com/package/zerossl) [![license](https://img.shields.io/npm/l/zerossl)](LICENSE.md)

- [ZeroSSL](#zerossl)
  - [Usage](#usage)
    - [Initialization](#initialization)
    - [Examples](#examples)
      - [Get a list of certificate records](#get-a-list-of-certificate-records)
      - [Get a certificate record](#get-a-certificate-record)
    - [Create a certificate](#create-a-certificate)
    - [Methods](#methods)
    - [Types](#types)
    - [Using a custom key pair](#using-a-custom-key-pair)
  - [Tests](#tests)
  - [Dependencies](#dependencies)
  - [Disclaimer](#disclaimer)
  - [License](#license)

## Usage

This library provides a wrapper for the [ZeroSSL REST API](https://zerossl.com/documentation/api).

It has been recently developed and as such, may still require some refinement. Please feel free
to feedback by opening an issue. Community contributions are appreciated.

*Note: while this is written in TypeScript, it is transpiled to JavaScript and will work
perfectly fine in a regular JavaScript project. Just ignore the TypeScript specific
annotations in the examples below.*

### Initialization

Creating an intance of ZeroSSL is easy. Make sure to keep your API key secret.

```typescript
import { ZeroSSL } from 'zerossl'

const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
const zerossl = new ZeroSSL({ accessKey })
```

### Examples

#### Get a list of certificate records

```typescript
import { ZeroSSL } from 'zerossl'

const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
const zerossl = new ZeroSSL({ accessKey })

const certificates = await zerossl.listCertificates()

certificates.results.forEach(certificate => {
  console.log(certificate.id, certificate.status, certificate.common_name)
})
```

#### Get a certificate record

```typescript
import { ZeroSSL } from 'zerossl'

const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
const zerossl = new ZeroSSL({ accessKey })

const certificate = await zerossl.getCertificates('<CERTIFICATE_ID>')

console.log(certificate)
```

### Create a certificate

```typescript
import { ZeroSSL } from 'zerossl'

const accessKey = process.env.ZEROSSL_ACCESS_KEY || ''
const zerossl = new ZeroSSL({ accessKey })

// Generate a keypair
const keyPair = zerossl.generateKeyPair()

// Generate a CSR
const csrOptions = {
  country: 'GB',
  state: 'England',
  locality: 'London',
  organization: '',
  organizationUnit: '',
  email: '<YOUR_EMAIL>',
  commonName: '<YOUR_DOMAIN_NAME>'
}
const csr = zerossl.generateCSR(keyPair, csrOptions)

// Create a certificate
const certificate = await zerossl.createCertificate({
  csr: csr,
  domains: ['<YOUR_DOMAIN_NAME>'],
  validityDays: 90,
  strictDomains: true
})

// Check it has been created
const checkResult = await zerossl.getCertificates(certificate.id)
console.log(checkResult)

// At this point, you should verify the domain
const verifyResult = await zerossl.verifyDomains(certificate.id, { validation_method: 'HTTP_CSR_HASH' })
console.log(verifyResult)

// Wait for ZeroSSL to issue certificate (anywhere up to 10 mins apparently)
```

For more examples, see the integration tests.

For an example of a basic HTTP verification server, see [adamkdean/zerossl-verify](https://github.com/adamkdean/zerossl-verify).

### Methods

The available methods mostly match those of the API, though there are a few additional methods.

```typescript
public async createCertificate(options: CreateCertificateOptions): Promise<CertificateRecord>
public async verifyDomains(id: string, options: VerifyDomainOptions): Promise<CertificateRecord>
public async downloadCertificate(id: string): Promise<Certificate>
public async getCertificate(id: string): Promise<CertificateRecord>
public async listCertificates(options?: ListCertificateOptions): Promise<CertificateList>
public async verificationStatus(id: string): Promise<VerificationStatus>
public async resendVerification(id: string): Promise<boolean>
public async cancelCertificate(id: string): Promise<boolean>
public async revokeCertificate(id: string): Promise<boolean>
public async validateCSR(csr: string): Promise<CertificateSigningRequestValidationResult>
public generateKeyPair(bits = 2048): KeyPair
public generateCSR(keypair: KeyPair, options: CertificateSigningRequestOptions): string
```

### Error Return

If an error occurs in your request, we will trigger a throw error detailing the error name, error code, error type and error status code through an object as you can see below:

```json
{
    "message": "An error has occurred",
    "code": "000",
    "type": "error_example",
    "status" : 400
}
```

### Types

You can access all the types used by this library by importing them from `zerossl/lib/types`, e.g.

```typescript
import { CertificateRecord } from 'zerossl/lib/types'
```

### Using a custom key pair

To use a custom key pair, you must ensure the private key is an RSA key in PEM format, and that the public key is in PEM format too.

To generate an RSA key pair, and convert the public key to PEM:

```sh
ssh-keygen -m pem -t rsa -b 4096
ssh-keygen -f <PUBLIC_KEY_FILE> -e -m pem > <PUBLIC_KEY_FILE>
```

You then simply need to create a KeyPair object:

```typescript
const keyPair = {
  privateKey: '<PRIVATE_KEY_PEM>',
  publicKey: '<PUBLIC_KEY_PEM>'
}

zerossl.generateCSR(keyPair, { ... })
```

## Tests

While I have endeavoured to write tests for this library, I have not
been able to comprehensively implement them. Most functionality has
been tested but as the documentation provided by ZeroSSL is quite
sparse, there may be edge cases that have not been accounted for.

Community contributions are welcome.

## Dependencies

This library only has two top-level dependencies: `node-forge` and `superagent`.

## Disclaimer

This library is a community open source project. There is no connection
with ZeroSSL or Stack Holdings GmbH. The term ZeroSSL/zerossl is recognised
as ZeroSSL™, a trademark of Stack Holdings GmbH in the USA, EU & UK and
this library is provided in good faith as a community open source project.

## License

MIT License

Copyright (c) 2022 Adam K Dean <adamkdean@googlemail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.