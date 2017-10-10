const {sign} = require('crypto-helpers');
const {createTransaction, verifyTransaction} = require('../../transaction');

describe("Transaction Block", () => {
  it("should create a transaction", () => {
    let block = createTransaction('walter', () => 'walter signature', {test: true});

    expect(block.id).not.toBe(null);
    expect(block.data).toEqual({test: true});
    expect(block.signature).toEqual("walter signature");
    expect(block.publicKey).toEqual("walter");
  });

  it("should verify a transaction", () => {
    const keys = {
      priv: `-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIMFXriqA9nZG1rw5oRNW5Phu8csodj9p8vaAJdy7u+VsoAcGBSuBBAAK
oUQDQgAESmMJ3U7H/G8nRVn6MoNy/xxYU4DHJd6KsfqpuIoSPk4CIBbI4zyClzzO
MlyfhZQ32LD4Wi4yyrvAJkdo09Ba8Q==
-----END EC PRIVATE KEY-----`,
      pub: `-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAESmMJ3U7H/G8nRVn6MoNy/xxYU4DHJd6K
sfqpuIoSPk4CIBbI4zyClzzOMlyfhZQ32LD4Wi4yyrvAJkdo09Ba8Q==
-----END PUBLIC KEY-----`,
    }

    let mySignature = ((privateKey) => {
      return (data) => {
        return sign(privateKey, data);
      };
    })(keys.priv);

    const block = createTransaction(keys.pub, mySignature, {test: true});

    expect(verifyTransaction(block)).toBe(true);
  });
});

