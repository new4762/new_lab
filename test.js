
const crypto = require('crypto');

const pk = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAg3Pl2zcVCOWBv7JZ3VQyQ082SjL5GauzWTyzPQxejtLBNkMfd/cH97TBV6Je5YMn46bY67ayFi2xfCoh8Lg0QWP8vVovfw8QIoyR4QaE0+zUiz4/i6M3k628pVBFrge/Iuz0CgmAN5g3AGS3CRq1+XdJvIwpbnfIrQY0UFubzUvKkQyNNiI2LINSXLKMjxp/jPRDbA81/CXmG47VVMwU8hr89xqSCKMLSw1KMbfn4SGy/6qosyIFebPyP3wdNrfRGHuiT1f7/3sfICtVT2/k5Rh2cpvI//nn9LuOVnVbIdIn5zLVvASKCzbxE2JyF4Bd6qbEotkSEmdrNzSaNd7MV7JV7D2r7EbVaajHZIiS8FwCCCCaDJeRM44uXZR30Kie2HzR3iTeQIe6g7Mdb8JsKHvgL9TXdSwfkbcuCOwCluwrVj1CpQkvBQ1xe31+/+cxBKXUUVnNZ9A1i57elgANEfxB7F6kGLFL+eFdIOU5Os0X+9wNTMkFgXAqHWoL7oaHR3ngFG0UsUv0Dhzx3q7/yPoFpVqf9XnjHwZf41NfwYFfoGMJ50HdmWpxDRPDKb3vfWgTVqLdo7hN4njg0Fm3yWg2EbiKDp29oenN6+FV6QmXeiy7Od2nLf1t00fwIbIvzwv2BW1k4MFzm7A6w954WoJnLI0Xf8uMdP/FebSZaFECAwEAAQ=="

let jsonValue = "hello";
let encryptedValue = encryptPublic(jsonValue, pk);
console.log(encryptedValue)

function encryptPublic(toEncrypt, publicKey) {
    const keyData = "-----BEGIN PUBLIC KEY-----\n" + publicKey + "\n-----END PUBLIC KEY-----";
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt({
            key: keyData.toString(),
            padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer)

    return encrypted.toString('base64')
}
