package signutil

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"github.com/google/uuid"
	"strconv"
	"strings"
	"sync"
	"time"
)

// 高级加密标准（Adevanced Encryption Standard ,AES）
// 16,24,32位字符串的话，分别对应AES-128，AES-192，AES-256 加密方法
// signKey 不能泄漏

var (
	signKey        string
	verifyKeyGroup []string
	verifyInvGroup []string
	lcgRand        *LCGRand
	verifyKeyOnce  sync.Once
)

func InitGlobalConfig(encodeKey string, keyGroup []string, invGroup []string) {
	verifyKeyOnce.Do(func() {
		signKey = encodeKey
		verifyKeyGroup = keyGroup
		verifyInvGroup = invGroup
		lcgRand = NewLCGRand(214013, 2531011, 1<<31, 0)
	})
}

type LCGRand struct {
	a     int //multiplier
	c     int //increment
	m     int //modulus
	r     int
	mutex sync.Locker
}

func NewLCGRand(a, c, m, send int) *LCGRand {
	return &LCGRand{a: a, c: c, m: m, r: send, mutex: new(sync.Mutex)}
}

func (l *LCGRand) Next() int {
	l.mutex.Lock()
	l.r = (l.a*l.r + l.c) % l.m
	l.mutex.Unlock()
	return l.r
}

func (l *LCGRand) Send(send int) {
	l.mutex.Lock()
	l.r = send
	l.mutex.Unlock()
}

// PKCS7 填充模式
func PKCS7Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	//Repeat()函数的功能是把切片[]byte{byte(padding)}复制padding个，然后合并成新的字节切片返回
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}

// 填充的反向操作，删除填充字符串
func PKCS7UnPadding(origData []byte) ([]byte, error) {
	//获取数据长度
	length := len(origData)
	if length == 0 {
		return nil, errors.New("加密字符串错误！")
	} else {
		//获取填充字符串长度
		unpadding := int(origData[length-1])
		//截取切片，删除填充字节，并且返回明文
		return origData[:(length - unpadding)], nil
	}
}

// 实现加密
func AesEncrypt(plaintext []byte, key []byte) ([]byte, error) {
	//创建加密算法实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//获取块的大小
	blockSize := block.BlockSize()
	//采用AES加密方法中CBC加密模式
	mode := cipher.NewCBCEncrypter(block, key[:blockSize])
	//对数据进行填充，让数据长度满足需求
	plaintext = PKCS7Padding(plaintext, blockSize)
	ciphertext := make([]byte, len(plaintext))
	//执行加密
	mode.CryptBlocks(ciphertext, plaintext)
	return ciphertext, nil
}

func AesEncryptHex(plaintext []byte, key []byte) (string, error) {
	ciphertext, err := AesEncrypt(plaintext, key)
	if err != nil {
		return "", err
	}

	ciphertextHex := hex.EncodeToString(ciphertext)
	return ciphertextHex, nil
}

// 实现解密
func AesDecrypt(ciphertext []byte, key []byte) ([]byte, error) {
	//创建加密算法实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//获取块大小
	blockSize := block.BlockSize()
	//创建加密客户端实例
	blockMode := cipher.NewCBCDecrypter(block, key[:blockSize])
	plaintext := make([]byte, len(ciphertext))
	//这个函数也可以用来解密
	blockMode.CryptBlocks(plaintext, ciphertext)
	//去除填充字符串
	plaintext, err = PKCS7UnPadding(plaintext)
	if err != nil {
		return nil, err
	}
	return plaintext, err
}

// 实现解密
func AesDecryptWithIv(ciphertext []byte, key, iv []byte) ([]byte, error) {
	//创建加密算法实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//创建加密客户端实例
	blockMode := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	//这个函数也可以用来解密
	blockMode.CryptBlocks(plaintext, ciphertext)
	//去除填充字符串
	plaintext, err = PKCS7UnPadding(plaintext)
	if err != nil {
		return nil, err
	}
	return plaintext, err
}

func AesEncryptionWithIv(plainText string, key, iv []byte) ([]byte, error) {
	//创建加密算法实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	//对数据进行填充，让数据长度满足需求
	var (
		bPlaintext = PKCS7Padding([]byte(plainText), aes.BlockSize)
		ciphertext = make([]byte, len(bPlaintext))
		mode       = cipher.NewCBCEncrypter(block, iv)
	)
	//执行加密
	mode.CryptBlocks(ciphertext, bPlaintext)
	return ciphertext, nil
}

func AesDecryptWithIvNoPadding(ciphertext []byte, key, iv []byte) ([]byte, error) {
	//创建加密算法实例
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	//创建加密客户端实例
	blockMode := cipher.NewCBCDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	//这个函数也可以用来解密
	blockMode.CryptBlocks(plaintext, ciphertext)
	return plaintext, err
}

func AesDecryptHex(ciphertextHex string, key []byte) ([]byte, error) {
	ciphertext, err := hex.DecodeString(ciphertextHex)
	if err != nil {
		return nil, err
	}

	return AesDecrypt(ciphertext, key)
}

// 加密base64
func EnPwdCode(pwd []byte) (string, error) {
	result, err := AesEncrypt(pwd, []byte(signKey))
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(result), err
}

// 解密
func DePwdCode(pwd string) ([]byte, error) {
	//解密base64字符串
	pwdByte, err := base64.StdEncoding.DecodeString(pwd)
	if err != nil {
		return nil, err
	}
	//执行AES解密
	return AesDecrypt(pwdByte, []byte(signKey))

}

func AesDecryptWithMulKey(ciphertextHex string) (string, error) {
	var key, iv = getKeyIV()
	ciphertext, err := hex.DecodeString(ciphertextHex)
	if err != nil {
		return "", err
	}

	plainText, err := AesDecryptWithIv(ciphertext, key, iv)
	if err != nil {
		return "", err
	}
	return string(plainText), nil
}

func AesEncryptionWithMulKey(plainText string) (string, error) {
	var key, iv = getKeyIV()
	ciphertext, err := AesEncryptionWithIv(plainText, key, iv)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(ciphertext), nil
}

func getKeyIV() ([]byte, []byte) {
	lcgRand.Send(time.Now().YearDay())
	var lcgVal = lcgRand.Next()
	return []byte(verifyKeyGroup[lcgVal%len(verifyKeyGroup)]), []byte(verifyInvGroup[lcgVal%len(verifyInvGroup)])
}

var _encode = []string{
	"a", "b", "c", "d", "e", "f",
	"g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
	"t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
	"6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
	"J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
	"W", "X", "Y", "Z", "~", "!", "@", "#", "$", "%", "^", "&"}

func generateKey(length int) (string, error) {
	random := uuid.NewString()
	random = strings.ReplaceAll(random, "-", "")
	random += strings.ReplaceAll(uuid.NewString(), "-", "")

	var buffer bytes.Buffer
	for i := 0; i < length; i++ {
		text := random[i : i+4]
		intValue, err := strconv.ParseInt(text, length, 64)
		if err != nil {
			return "", err
		}

		buffer.WriteString(_encode[intValue%69])
	}

	return buffer.String(), nil
}





func TestEncodeData(t *testing.T) {
	var siteKey = "3WLjoEqTgf#wOCe9"
	var keyGroupStr = "os%Iijn4GPJVDp37JABQ5TcSgK6ii^oF,DwE@3^k^6I@ie%i66syi5WyyQ0Ervm#u,js@V4Wlrxm5TdBR5^t8Q29eA#VK8oWtu,O3W4W#@DFUr7yrWtb~JTpK@4uDJ!IssA,bNnitx5!UAmHcecreBq#HQsnPRDYEhV8,p5sT$zGnWoLraiuOTZFe3mfqtq$O51tK,r675kuzpFcn!QpOoZ7b8DSS#K32Xs@Cy,TsF3Ui9nsiUgmM1Aoj$quzWqTWqDY~qF,idEr@@sBEhLm!x9xtmi1b^nRs0dmZlLO,4FURwcBPcoUXIAIp$WNKR^Mehj6HX0Ja,ZE@ZvIPS%WfQ8!XkMkc4LWokF9bm3~@S,%0IuA6nBKj120llRfu7WEHRfO4qPkgHm,NK6wMQhr4N2fvYc53cgEzFZuErSwBU1n,G^qA9mNZnBLfu3A$Zd!Xbuml@rUt$rRr,E%Wk4jM4tiytqDHq^1!!r5skWSjdqjGh,GTXrOB2h^DNAcdIZ$XX1~0sd20Ec#w9V,OHXMZTQ$YYH$1I7srkjgE6k6AOrsYsGz,UcUAfirKP#34u0YdCSz0EU66h2uV%g!~,u32NA2Ta#oJeQqNcB49eI1GqXAV^^y$R,!VSTE6b8Yxw#DodBLqlRYMKVFheLYeFC,ofT~Q3FJ3^f51JuwOR#Ps1zOqJiE~Y7b,bXuq^jCBrllV2h%Sp1HOwdvu1erjctic,iW#3$rIkMtlqL!jCsPdrAUxnnQ%e6izT,tKK7u8gxK1rAY%ovUNffzqSNaDGA9lu#,X#vR34225LII57cACMx3DYtvu5qFKIvZ,Sq#Wgh8#LVX7$PP2aA^zIFrEKUl#zsI~,!VwS1W657gB7FisuAW~GOwEvVFtM#S!R,DBMg5iGxvB#1Z3Rj~uRP~n2gVdQOk2DQ,e!GQauLPYY3~e^kOyKVf00QYHH5rtwuA,9FhvZkwTBLwpwv^8oJx9#y$to9841#aV,4V7o25vK~eeHceeoG#Ub$RuNqxjMAz5R,%r3P#6^HNQ@7$O%4Huz!1!aYX7xoP8G~,ONC@tyGSqpi%^KjZmmiHlLk5VEDg4@HJ,3f#mvPHVouN2K7GnqsggXM9qW#zbWonk,KonFnNpPbpPUY%%rnUXlWu0$bp9tBdcE,#VMXRVfrJK~q3FZ^WMRq2AGhr@UkL#rI,o3XOLDdtk@Or2hgEuD@jzVB~jwD^BN0S,NkA^6!z2I4m#Snf~%Z0mbtNwQPR@3!$%,iGbyKL~~V$LnAT3UrZA7!@vanVNz1xSN,YuOEYhRup96aWccNvsuBr$5%nEm2B9c@,^19WDUzjVPkbf5aFW9B1BN07jVCKbB$r,1t#$In0ypQzFUf#5KvgVI8^OgvXZ@I9B,9Q0#QaloW3HF3E5NfV#EhiRxm$bK%o9%,N#zV~nmGHofpBtVmC%Xa6fex3N!78efH,7eJ3Nq^Fw9~jt$ZRF@czBPTZXNQltrxl,AtFmI!ZfhTQCL!e4n4Nhl5TxSCY$3pNH,1fiNLzRuwPaPEKZn3U8Cb#fR!FrM7L9r,GkYq9Ap0e1ffbGBp2VTSruIksH72ehAI,PfcfY~XK52Rvd8~Tlr9%li3CXynVYV6l,0LJ@U6xENtAh!x3aWq6SLYbqE0Ea89A1,V66KVTGsDzpiDqs88IJmcPpUYJoNupUa,mNaNuE6WDYX4vXT$U0DTMAZGPPl78FnG,H76w0zlF1UamMzMtXAM3$Xec5p4HG2KJ,EGOa0l1dvR3yGF!hQAN~dOx3pnQnMMDS,6gA%EvAk4pS#juYu7Bl401hRbdb3TwS@,!lkI7T999ct3zNCMy8D^QKIAM!D~QmB@,Eiuydb6#ZUIP1IBwtf06i6PuetYfmMgA,a@XkQ0!DNR2fmNZu$1Yz8mjh!nVJR^~e,~@QwTx$K2s1G0lgBxRPqi#@u6lxZISmL,Eu259!ppZC5ToGiXCbvj7yy0ZXDVnDFq"
	var invGroupStr = "LHowGfo~FnhveZEx,mroR@Gzk#zXNErmP,Kg$aIDfq^ea$0%I3,eCKWNDVj~KhdU$0a,ufokjgUeHsy9%7Ej,0q6iG9#vB68u0$4Y,@KIk#ivGLTWle~ik,799tSjTanfrmqL%0,p~wiAqFLYEvvqL$4,jA2WKXwq!vwJXJh6,tLj6iKZp21ReLV5F,AdN0EvNT0jiXNu3U,#uhzAhAnIZBUiSm6,ZsofXvwr~4Q7Nu3@,dE4G$xMm!NrbCQ#q,MyO0VgKw1OqS4~~@,h8cF9EVPEkoWqKGu,fSvSb0ns2%EWLY%$,Yk67aAcJrH$9$r1M,MradWFjxzLbp61zV,S5pDgVMjiifUU#^^,VX1t8QsQ5Ji^p4JX,!y#NzEMuh!5#H~3H,RkxkY2HH@iYp60Sf,9kquPfJJUJ6s3KYR,NnalKQvg%o5VF5oz,$Dee5ukHD!I7iSW0,SQZ0O4xy8Se7vU30,58XNIEnU$FVFU!lM,pmpl0ac3V9C$#bMX,NIs5qPO96AFcD%g@,$2dmqht8jEXODbVS,uzaqodxdBf0fKHkW,xQuaE0I7nZmCr~ey,6ciibq1d3b1VS7W6,OY#qyGZ!bMDt61FD,G@6YXroXw^FG@Ux!,E6O6s8huoAxxNxDO,!UeN^3Q9x4cS!C3C,ApDmZ!CGlW2jiUbg,QQkvNJE~4cwYiVHa,u81rkhJLOgTYRr^^,Byp9scAyfHw1EpIm,a90owof1jzXIe~Su,KWHGREPoWwDB0%y3,%ys@qB^HHKwN9eyH,b^Np~sbGdD2i7Ght,ekDLhZGKQlDxJ1uR,r7DKKNadx4neiT8Q,jAn@lPYvMVz3OC^9,qM3Ee7FtWjiqS8R2,NQtbjD6sjQvYhEqk,WRCGEKFS~YB1Vk5o,Rm13BNedsXKdH#Cg,$uu4!e9%907QiVEh,kgZBgIivec^~W2au,m#h9OHlz1wZmqLbP,mcX7UObPLSzWYYZF,fEkDVhyl~d6hxuZQ,8jk7xxfgh!JeCSS2"

	InitGlobalConfig(siteKey, strings.Split(keyGroupStr, ","), strings.Split(invGroupStr, ","))

	var dataStr = `{
    "scan_id":"202110130310281448123945269071872"
}`

	firstData, err := AesEncryptionWithMulKey(string(dataStr))

	fmt.Printf("%s\n,err:%+v", firstData, err)
	//0bf38c8c50276add2b6d0158e73b21a3096f24105b9cdd19f8dba8762c63b386ba8de29aaff947f74449285cb387d5277fe6b57a3078d181a900eaafd9b39bfa

	respStr, err := EnPwdCode([]byte(firstData))

	fmt.Printf("%s\n,err:%+v", respStr, err)
//encode:wE6EoWYXP6c7Avgvwyat1GhIWhvffL/5yxy27GSBH0vvZfExh2STfosEPdeD7M5EIwEBe2d+59fI1EpOfG05fVIcU++3AcKYepi2uzjzT82XKteip4yiwoBb/J/ZblCjUHXvfB2PNhhsqes5JrJRoHaIH1KFqHbMyHKx/VYiVNYxqkrivzacL75OlNH4yqqf
}

func TestDecodeData(t *testing.T) {
	var siteKey = "3WLjoEqTgf#wOCe9"
	var keyGroupStr = "os%Iijn4GPJVDp37JABQ5TcSgK6ii^oF,DwE@3^k^6I@ie%i66syi5WyyQ0Ervm#u,js@V4Wlrxm5TdBR5^t8Q29eA#VK8oWtu,O3W4W#@DFUr7yrWtb~JTpK@4uDJ!IssA,bNnitx5!UAmHcecreBq#HQsnPRDYEhV8,p5sT$zGnWoLraiuOTZFe3mfqtq$O51tK,r675kuzpFcn!QpOoZ7b8DSS#K32Xs@Cy,TsF3Ui9nsiUgmM1Aoj$quzWqTWqDY~qF,idEr@@sBEhLm!x9xtmi1b^nRs0dmZlLO,4FURwcBPcoUXIAIp$WNKR^Mehj6HX0Ja,ZE@ZvIPS%WfQ8!XkMkc4LWokF9bm3~@S,%0IuA6nBKj120llRfu7WEHRfO4qPkgHm,NK6wMQhr4N2fvYc53cgEzFZuErSwBU1n,G^qA9mNZnBLfu3A$Zd!Xbuml@rUt$rRr,E%Wk4jM4tiytqDHq^1!!r5skWSjdqjGh,GTXrOB2h^DNAcdIZ$XX1~0sd20Ec#w9V,OHXMZTQ$YYH$1I7srkjgE6k6AOrsYsGz,UcUAfirKP#34u0YdCSz0EU66h2uV%g!~,u32NA2Ta#oJeQqNcB49eI1GqXAV^^y$R,!VSTE6b8Yxw#DodBLqlRYMKVFheLYeFC,ofT~Q3FJ3^f51JuwOR#Ps1zOqJiE~Y7b,bXuq^jCBrllV2h%Sp1HOwdvu1erjctic,iW#3$rIkMtlqL!jCsPdrAUxnnQ%e6izT,tKK7u8gxK1rAY%ovUNffzqSNaDGA9lu#,X#vR34225LII57cACMx3DYtvu5qFKIvZ,Sq#Wgh8#LVX7$PP2aA^zIFrEKUl#zsI~,!VwS1W657gB7FisuAW~GOwEvVFtM#S!R,DBMg5iGxvB#1Z3Rj~uRP~n2gVdQOk2DQ,e!GQauLPYY3~e^kOyKVf00QYHH5rtwuA,9FhvZkwTBLwpwv^8oJx9#y$to9841#aV,4V7o25vK~eeHceeoG#Ub$RuNqxjMAz5R,%r3P#6^HNQ@7$O%4Huz!1!aYX7xoP8G~,ONC@tyGSqpi%^KjZmmiHlLk5VEDg4@HJ,3f#mvPHVouN2K7GnqsggXM9qW#zbWonk,KonFnNpPbpPUY%%rnUXlWu0$bp9tBdcE,#VMXRVfrJK~q3FZ^WMRq2AGhr@UkL#rI,o3XOLDdtk@Or2hgEuD@jzVB~jwD^BN0S,NkA^6!z2I4m#Snf~%Z0mbtNwQPR@3!$%,iGbyKL~~V$LnAT3UrZA7!@vanVNz1xSN,YuOEYhRup96aWccNvsuBr$5%nEm2B9c@,^19WDUzjVPkbf5aFW9B1BN07jVCKbB$r,1t#$In0ypQzFUf#5KvgVI8^OgvXZ@I9B,9Q0#QaloW3HF3E5NfV#EhiRxm$bK%o9%,N#zV~nmGHofpBtVmC%Xa6fex3N!78efH,7eJ3Nq^Fw9~jt$ZRF@czBPTZXNQltrxl,AtFmI!ZfhTQCL!e4n4Nhl5TxSCY$3pNH,1fiNLzRuwPaPEKZn3U8Cb#fR!FrM7L9r,GkYq9Ap0e1ffbGBp2VTSruIksH72ehAI,PfcfY~XK52Rvd8~Tlr9%li3CXynVYV6l,0LJ@U6xENtAh!x3aWq6SLYbqE0Ea89A1,V66KVTGsDzpiDqs88IJmcPpUYJoNupUa,mNaNuE6WDYX4vXT$U0DTMAZGPPl78FnG,H76w0zlF1UamMzMtXAM3$Xec5p4HG2KJ,EGOa0l1dvR3yGF!hQAN~dOx3pnQnMMDS,6gA%EvAk4pS#juYu7Bl401hRbdb3TwS@,!lkI7T999ct3zNCMy8D^QKIAM!D~QmB@,Eiuydb6#ZUIP1IBwtf06i6PuetYfmMgA,a@XkQ0!DNR2fmNZu$1Yz8mjh!nVJR^~e,~@QwTx$K2s1G0lgBxRPqi#@u6lxZISmL,Eu259!ppZC5ToGiXCbvj7yy0ZXDVnDFq"
	var invGroupStr = "LHowGfo~FnhveZEx,mroR@Gzk#zXNErmP,Kg$aIDfq^ea$0%I3,eCKWNDVj~KhdU$0a,ufokjgUeHsy9%7Ej,0q6iG9#vB68u0$4Y,@KIk#ivGLTWle~ik,799tSjTanfrmqL%0,p~wiAqFLYEvvqL$4,jA2WKXwq!vwJXJh6,tLj6iKZp21ReLV5F,AdN0EvNT0jiXNu3U,#uhzAhAnIZBUiSm6,ZsofXvwr~4Q7Nu3@,dE4G$xMm!NrbCQ#q,MyO0VgKw1OqS4~~@,h8cF9EVPEkoWqKGu,fSvSb0ns2%EWLY%$,Yk67aAcJrH$9$r1M,MradWFjxzLbp61zV,S5pDgVMjiifUU#^^,VX1t8QsQ5Ji^p4JX,!y#NzEMuh!5#H~3H,RkxkY2HH@iYp60Sf,9kquPfJJUJ6s3KYR,NnalKQvg%o5VF5oz,$Dee5ukHD!I7iSW0,SQZ0O4xy8Se7vU30,58XNIEnU$FVFU!lM,pmpl0ac3V9C$#bMX,NIs5qPO96AFcD%g@,$2dmqht8jEXODbVS,uzaqodxdBf0fKHkW,xQuaE0I7nZmCr~ey,6ciibq1d3b1VS7W6,OY#qyGZ!bMDt61FD,G@6YXroXw^FG@Ux!,E6O6s8huoAxxNxDO,!UeN^3Q9x4cS!C3C,ApDmZ!CGlW2jiUbg,QQkvNJE~4cwYiVHa,u81rkhJLOgTYRr^^,Byp9scAyfHw1EpIm,a90owof1jzXIe~Su,KWHGREPoWwDB0%y3,%ys@qB^HHKwN9eyH,b^Np~sbGdD2i7Ght,ekDLhZGKQlDxJ1uR,r7DKKNadx4neiT8Q,jAn@lPYvMVz3OC^9,qM3Ee7FtWjiqS8R2,NQtbjD6sjQvYhEqk,WRCGEKFS~YB1Vk5o,Rm13BNedsXKdH#Cg,$uu4!e9%907QiVEh,kgZBgIivec^~W2au,m#h9OHlz1wZmqLbP,mcX7UObPLSzWYYZF,fEkDVhyl~d6hxuZQ,8jk7xxfgh!JeCSS2"

	InitGlobalConfig(siteKey, strings.Split(keyGroupStr, ","), strings.Split(invGroupStr, ","))

	var dataStr = `p0gwQ/d6WZtE9LFQcP7a0IOT65dNXYpb3kD5UU2Vw2FBx7pdBFFnxe0Ds/gGvSZWRHaVdp8s5EvZ8CjblshJL3EFESx+SOEge/JfwUnU2W/Sne3ZMAA8zVTILtfOD7K36Xv5eXhiCh317u+f/aleHEHC7re3eSJIU1X8fDsl3Wo0fdeQmsumJp94iIjyW9tlRiFsilCnk3Uxr+ll2T3LAY97zHHsnyiVObCTPG3GmpA=`

	aesEcbData, err := DePwdCode(string(dataStr))
	fmt.Printf("%s\n,err:%+v", aesEcbData, err)

	actualRequestData, err := AesDecryptWithMulKey(string(aesEcbData))

	fmt.Printf("%s\n,err:%+v", actualRequestData, err)

}