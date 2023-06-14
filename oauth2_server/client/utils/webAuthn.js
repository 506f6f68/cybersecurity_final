import CBOR from "./CBOR";

const base64url = {
  encode: (buf) => {
    const base64 = btoa(String.fromCharCode(...buf));
    return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  },
  decode: (str) => {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const array = new Uint8Array(
      atob(str)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    return array;
  },
};

export const Login = async (cred_id) => {
  var challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);
  const publicKeyCredentialRequestOptions = {
    challenge: challenge,
    allowCredentials: [
      {
        id: base64url.decode(cred_id),
        type: "public-key",
        transports: ["internal"],
      },
    ],
    timeout: 60000,
    authenticatorSelection: { userVerification: "preferred" },
  };
  const assertion = await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions,
  });

  //TODO:驗證挑戰是否相符（15分）
  // authenticatorDataBytes = assertion.response.authenticatorData;
  let clientDataJSON = assertion.response.clientDataJSON;
  let clientDataJSON_string = new TextDecoder().decode(clientDataJSON);
  let clientDataJSON_JSON = JSON.parse(clientDataJSON_string);
  // console.log(clientDataJSON_JSON.challenge);

  if (base64url.encode(challenge) !== clientDataJSON_JSON.challenge) {
    alert("Challenges are not the same.");
    throw new Error("Challenges are not the same.");
    return;
  }

  return assertion;
  // console.log(assertion.response.clientDataJSON);
  // console.log(assertion.response.authenticatorData);
  // console.log(assertion.response.signature);
};

export const Registration = async (personal_id) => {
  //創建挑戰（實務上應由後端創建會較保險）
  var challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  //創建publicKey物件（投影片p9）
  var publicKey = {
    challenge: challenge,
    rp: {
      name: "localhost",
    },
    user: {
      id: Uint8Array.from(personal_id, (c) => c.charCodeAt(0)),
      name: personal_id,
      displayName: personal_id,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
    },
    timeout: 60000,
    attestation: "direct",
  };
  try {
    const newCredentialInfo = await navigator.credentials.create({
      publicKey: publicKey,
    });

    const decodedAttestationObj = CBOR.decode(
      newCredentialInfo.response.attestationObject
    );
    console.log(decodedAttestationObj);

    // decode the clientDataJSON into a utf-8 string
    const utf8Decoder = new TextDecoder("utf-8");
    const decodedClientData = utf8Decoder.decode(
      newCredentialInfo.response.clientDataJSON
    );
    // parse the string as an object
    const clientDataObj = JSON.parse(decodedClientData);
    //   console.log("clientDataObj", clientDataObj);
    //   console.log(clientDataObj.challenge);

    const { authData } = decodedAttestationObj;
    const dataView = new DataView(new ArrayBuffer(2));
    const idLenBytes = authData.slice(53, 55);
    idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
    const credentialIdLength = dataView.getUint16();
    const credentialId = authData.slice(55, 55 + credentialIdLength);
    const publicKeyBytes = authData.slice(55 + credentialIdLength);
    const publicKeyObject = CBOR.decode(publicKeyBytes.buffer);

    // 驗證挑戰是否相符
    if (base64url.encode(challenge) !== clientDataObj.challenge) {
      alert("Challenges are not the same.");
      throw new Error("Challenges are not the same.");
    }
    return {
      credId: base64url.encode(credentialId),
      publicKey: JSON.stringify(publicKeyObject),
    };
  } catch (error) {
    console.log(error);
    console.log("FAIL", error);
  }
};

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
