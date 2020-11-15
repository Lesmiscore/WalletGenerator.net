@GrabResolver(name='jitpack.io', root='https://jitpack.io/')
@GrabResolver(name='jcenter', root='https://jcenter.bintray.com/')
@GrabResolver(name='maven', root='https://repo.maven.apache.org/maven2/')
@Grab('com.github.NemProject:nem.core:v0.6.97')
import org.nem.core.crypto.*
import org.nem.core.model.*
import org.nem.core.utils.*
import org.nem.core.crypto.ed25519.*

def privKey= ([0,1,2,3]*8) as byte[]
println "privateKey: ${privKey.encodeHex()}"
def privKeyScalar=new BigInteger(privKey)

def sk=new PrivateKey(privKeyScalar)
def kp=new KeyPair(sk)

def scalar=Ed25519Utils.prepareForScalarMultiply(sk)
println "scalar: ${scalar.raw.encodeHex()}"

def pk=kp.publicKey
println "publicKey: ${pk.raw.encodeHex()}"

def addr=Address.fromPublicKey(104 as byte,pk)
println "address: $addr"

//import org.bouncycastle.jcajce.provider.digest.Keccak
//def keccak = new Keccak.Digest512();
//println keccak.digest(privKey).encodeHex()
//println Hashes.sha3_512(new byte[][]{privKey}).encodeHex()

//println ArrayUtils.toByteArray(privKeyScalar, 32)
