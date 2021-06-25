export const b64toBlob = (
  b64Data: string,
  contentType = '',
  sliceSize = 512,
) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {type: contentType});
};

export const parseBase64 = (data: string) => {
  const [dataType, encoded] = data.split(';base64,');
  const type = dataType.split(':')[1];
  return {type, data: encoded, extension: type.split('/')[1]};
};

export const toUsername = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\s/gi, '_')
    .replace(/[^a-zA-Z0-9_]/gi, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const getAppURL = (refresh: string, deviceId: string) => {
  const base = __DEV__
    ? 'https://kweek-business.ngrok.io'
    : 'https://mobile.kweek.africa';

  return `${base}/go/${refresh}/?deviceId=${deviceId}`;
};

export const parse = (str: string) => {
  return parseInt(str.replace(/,/g, '')) || 0;
};

export const isToday = someDate => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const spaceString = (str: string, charCount: number) => {
  const segments = [];
  for (let i = 0; i < str.length / charCount; i++) {
    segments.push(str.substring(i * charCount, (i + 1) * charCount));
  }
  return segments.join(' ');
};

export const spaceFour = (str: string) => spaceString(str, 4);

export enum CardPaymentOperationType {
  purchase,
  fund,
}

export enum P2PTxnType {
  send,
  request,
}

export enum Constants {
  transferFees = 25,
  withdrawFees = 100,
  defaultUSDRate = 610,
  defaultCardRate = 650,
}
