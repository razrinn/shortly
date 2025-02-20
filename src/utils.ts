import { customAlphabet } from 'nanoid';

export function nanoid(length = 8) {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return customAlphabet(alphabet, length)();
}

export function parseUserAgent(userAgent: string) {
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  let browser:
    | 'Unknown'
    | 'Chrome'
    | 'Firefox'
    | 'Safari'
    | 'Edge'
    | 'Internet Explorer' = 'Unknown';
  let os: 'Unknown' | 'Windows' | 'MacOS' | 'Android' | 'Linux' | 'iOS' =
    'Unknown';

  if (/Chrome/i.test(userAgent)) browser = 'Chrome';
  else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent))
    browser = 'Safari';
  else if (/Edge/i.test(userAgent)) browser = 'Edge';
  else if (/MSIE|Trident/i.test(userAgent)) browser = 'Internet Explorer';

  if (/Windows/i.test(userAgent)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = 'MacOS';
  else if (/Android/i.test(userAgent)) os = 'Android';
  else if (/Linux/i.test(userAgent)) os = 'Linux';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) os = 'iOS';

  return { browser, os, isMobile };
}

export async function hashIpAddress(ip: string | undefined): Promise<string> {
  if (!ip) {
    return '';
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedIp = hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
  return hashedIp;
}
