import { AES, enc, mode, pad } from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

let signKey: string;
let verifyKeyGroup: string[];
let verifyInvGroup: string[];
let lcgRand: LCGRand;

function InitGlobalConfig(encodeKey: string, keyGroup: string[], invGroup: string[]) {
  signKey = encodeKey;
  verifyKeyGroup = keyGroup;
  verifyInvGroup = invGroup;
  lcgRand = new LCGRand(214013, 2531011, 1 << 31, 0);
}

class LCGRand {
  private a: number;
  private c: number;
  private m: number;
  private r: number;
  private mutex: any;

  constructor(a: number, c: number, m: number, send: number) {
    this.a = a;
    this.c = c;
    this.m = m;
    this.r = send;
    this.mutex = new (class Mutex {
      lock() { }
      unlock() { }
    })();
  }

  public Next(): number {
    this.mutex.lock();
    this.r = (this.a * this.r + this.c) % this.m;
    this.mutex.unlock();
    return this.r;
  }

  public Send(send: number): void {
    this.mutex.lock();
    this.r = send;
    this.mutex.unlock();
  }
}

function AesEncrypt(plaintext: CryptoJS.lib.WordArray, key: CryptoJS.lib.WordArray) {
  return AES.encrypt(plaintext, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}

function AesEncryptHex(plaintext: CryptoJS.lib.WordArray, key: CryptoJS.lib.WordArray): string {
  const ciphertext = AesEncrypt(plaintext, key);
  return ciphertext.ciphertext.toString(enc.Hex);
}

function AesDecrypt(ciphertext: string | CryptoJS.lib.CipherParams, key: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  return AES.decrypt(ciphertext, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}

function AesDecryptWithIv(ciphertext: string | CryptoJS.lib.CipherParams, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray): CryptoJS.lib.WordArray {
  return AES.decrypt(ciphertext, key, {
    mode: mode.CBC,
    padding: pad.Pkcs7,
    iv,
  });
}

function EnPwdCode(pwd: CryptoJS.lib.WordArray): string {
  const ciphertext = AesEncrypt(pwd, enc.Utf8.parse(signKey));
  return enc.Base64.stringify(ciphertext.ciphertext)
}

function DePwdCode(pwd: string): CryptoJS.lib.WordArray {
  const ciphertext = enc.Base64.parse(pwd);
  return AesDecrypt(CryptoJS.lib.CipherParams.create({
    ciphertext
  }), enc.Utf8.parse(signKey));
}

function AesDecryptWithMulKey(ciphertextHex: string): string {
  const [key, iv] = getKeyIV();
  const ciphertext = enc.Hex.parse(ciphertextHex);
  const decrypted = AesDecryptWithIv(CryptoJS.lib.CipherParams.create({
    ciphertext
  }), key, iv);
  return decrypted.toString(enc.Utf8);
}

function AesEncryptionWithMulKey(plainText: string): string {
  const [key, iv] = getKeyIV();
  const ciphertext = AesEncryptionWithIv(enc.Utf8.parse(plainText), key, iv);
  return ciphertext.ciphertext.toString(enc.Hex);
}

function AesEncryptionWithIv(
  plaintext: CryptoJS.lib.WordArray,
  key: CryptoJS.lib.WordArray,
  iv: CryptoJS.lib.WordArray
) {
  return AES.encrypt(plaintext, key, {
    iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}
function getKeyIV(): [CryptoJS.lib.WordArray, CryptoJS.lib.WordArray] {
  const day = new Date().getUTCDate()//new Date().getDayOfYear()
  lcgRand.Send(day);
  const lcgVal = lcgRand.Next();
  const key = enc.Utf8.parse(verifyKeyGroup[lcgVal % verifyKeyGroup.length]);
  const iv = enc.Utf8.parse(verifyInvGroup[lcgVal % verifyInvGroup.length]);
  return [key, iv];
}

const _encode = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '~',
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
];

function generateKey(length: number): string {
  const random = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
  let key = '';
  for (let i = 0; i < length; i++) {
    const text = random.substr(i * 4, 4);
    const intValue = parseInt(text, length);
    key += _encode[intValue % 69];
  }
  return key;
}



InitGlobalConfig(
  "NwfDWTYATG$kTj9PcVdebR",
  "os%Iijn4GPJVDp37JABQ5TcSgK6ii^oF,DwE@3^k^6I@ie%i66syi5WyyQ0Ervm#u,js@V4Wlrxm5TdBR5^t8Q29eA#VK8oWtu,O3W4W#@DFUr7yrWtb~JTpK@4uDJ!IssA,bNnitx5!UAmHcecreBq#HQsnPRDYEhV8,p5sT$zGnWoLraiuOTZFe3mfqtq$O51tK,r675kuzpFcn!QpOoZ7b8DSS#K32Xs@Cy,TsF3Ui9nsiUgmM1Aoj$quzWqTWqDY~qF,idEr@@sBEhLm!x9xtmi1b^nRs0dmZlLO,4FURwcBPcoUXIAIp$WNKR^Mehj6HX0Ja,ZE@ZvIPS%WfQ8!XkMkc4LWokF9bm3~@S,%0IuA6nBKj120llRfu7WEHRfO4qPkgHm,NK6wMQhr4N2fvYc53cgEzFZuErSwBU1n,G^qA9mNZnBLfu3A$Zd!Xbuml@rUt$rRr,E%Wk4jM4tiytqDHq^1!!r5skWSjdqjGh,GTXrOB2h^DNAcdIZ$XX1~0sd20Ec#w9V,OHXMZTQ$YYH$1I7srkjgE6k6AOrsYsGz,UcUAfirKP#34u0YdCSz0EU66h2uV%g!~,u32NA2Ta#oJeQqNcB49eI1GqXAV^^y$R,!VSTE6b8Yxw#DodBLqlRYMKVFheLYeFC,ofT~Q3FJ3^f51JuwOR#Ps1zOqJiE~Y7b,bXuq^jCBrllV2h%Sp1HOwdvu1erjctic,iW#3$rIkMtlqL!jCsPdrAUxnnQ%e6izT,tKK7u8gxK1rAY%ovUNffzqSNaDGA9lu#,X#vR34225LII57cACMx3DYtvu5qFKIvZ,Sq#Wgh8#LVX7$PP2aA^zIFrEKUl#zsI~,!VwS1W657gB7FisuAW~GOwEvVFtM#S!R,DBMg5iGxvB#1Z3Rj~uRP~n2gVdQOk2DQ,e!GQauLPYY3~e^kOyKVf00QYHH5rtwuA,9FhvZkwTBLwpwv^8oJx9#y$to9841#aV,4V7o25vK~eeHceeoG#Ub$RuNqxjMAz5R,%r3P#6^HNQ@7$O%4Huz!1!aYX7xoP8G~,ONC@tyGSqpi%^KjZmmiHlLk5VEDg4@HJ,3f#mvPHVouN2K7GnqsggXM9qW#zbWonk,KonFnNpPbpPUY%%rnUXlWu0$bp9tBdcE,#VMXRVfrJK~q3FZ^WMRq2AGhr@UkL#rI,o3XOLDdtk@Or2hgEuD@jzVB~jwD^BN0S,NkA^6!z2I4m#Snf~%Z0mbtNwQPR@3!$%,iGbyKL~~V$LnAT3UrZA7!@vanVNz1xSN,YuOEYhRup96aWccNvsuBr$5%nEm2B9c@,^19WDUzjVPkbf5aFW9B1BN07jVCKbB$r,1t#$In0ypQzFUf#5KvgVI8^OgvXZ@I9B,9Q0#QaloW3HF3E5NfV#EhiRxm$bK%o9%,N#zV~nmGHofpBtVmC%Xa6fex3N!78efH,7eJ3Nq^Fw9~jt$ZRF@czBPTZXNQltrxl,AtFmI!ZfhTQCL!e4n4Nhl5TxSCY$3pNH,1fiNLzRuwPaPEKZn3U8Cb#fR!FrM7L9r,GkYq9Ap0e1ffbGBp2VTSruIksH72ehAI,PfcfY~XK52Rvd8~Tlr9%li3CXynVYV6l,0LJ@U6xENtAh!x3aWq6SLYbqE0Ea89A1,V66KVTGsDzpiDqs88IJmcPpUYJoNupUa,mNaNuE6WDYX4vXT$U0DTMAZGPPl78FnG,H76w0zlF1UamMzMtXAM3$Xec5p4HG2KJ,EGOa0l1dvR3yGF!hQAN~dOx3pnQnMMDS,6gA%EvAk4pS#juYu7Bl401hRbdb3TwS@,!lkI7T999ct3zNCMy8D^QKIAM!D~QmB@,Eiuydb6#ZUIP1IBwtf06i6PuetYfmMgA,a@XkQ0!DNR2fmNZu$1Yz8mjh!nVJR^~e,~@QwTx$K2s1G0lgBxRPqi#@u6lxZISmL,Eu259!ppZC5ToGiXCbvj7yy0ZXDVnDFq".split(','),
  "LHowGfo~FnhveZEx,mroR@Gzk#zXNErmP,Kg$aIDfq^ea$0%I3,eCKWNDVj~KhdU$0a,ufokjgUeHsy9%7Ej,0q6iG9#vB68u0$4Y,@KIk#ivGLTWle~ik,799tSjTanfrmqL%0,p~wiAqFLYEvvqL$4,jA2WKXwq!vwJXJh6,tLj6iKZp21ReLV5F,AdN0EvNT0jiXNu3U,#uhzAhAnIZBUiSm6,ZsofXvwr~4Q7Nu3@,dE4G$xMm!NrbCQ#q,MyO0VgKw1OqS4~~@,h8cF9EVPEkoWqKGu,fSvSb0ns2%EWLY%$,Yk67aAcJrH$9$r1M,MradWFjxzLbp61zV,S5pDgVMjiifUU#^^,VX1t8QsQ5Ji^p4JX,!y#NzEMuh!5#H~3H,RkxkY2HH@iYp60Sf,9kquPfJJUJ6s3KYR,NnalKQvg%o5VF5oz,$Dee5ukHD!I7iSW0,SQZ0O4xy8Se7vU30,58XNIEnU$FVFU!lM,pmpl0ac3V9C$#bMX,NIs5qPO96AFcD%g@,$2dmqht8jEXODbVS,uzaqodxdBf0fKHkW,xQuaE0I7nZmCr~ey,6ciibq1d3b1VS7W6,OY#qyGZ!bMDt61FD,G@6YXroXw^FG@Ux!,E6O6s8huoAxxNxDO,!UeN^3Q9x4cS!C3C,ApDmZ!CGlW2jiUbg,QQkvNJE~4cwYiVHa,u81rkhJLOgTYRr^^,Byp9scAyfHw1EpIm,a90owof1jzXIe~Su,KWHGREPoWwDB0%y3,%ys@qB^HHKwN9eyH,b^Np~sbGdD2i7Ght,ekDLhZGKQlDxJ1uR,r7DKKNadx4neiT8Q,jAn@lPYvMVz3OC^9,qM3Ee7FtWjiqS8R2,NQtbjD6sjQvYhEqk,WRCGEKFS~YB1Vk5o,Rm13BNedsXKdH#Cg,$uu4!e9%907QiVEh,kgZBgIivec^~W2au,m#h9OHlz1wZmqLbP,mcX7UObPLSzWYYZF,fEkDVhyl~d6hxuZQ,8jk7xxfgh!JeCSS2".split(',')
)

const env1 = AesEncryptionWithMulKey("喜洋洋")
const dev1 = AesDecryptWithMulKey(env1)