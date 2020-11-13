@GrabResolver(name='jitpack.io', root='https://jitpack.io/')
@GrabResolver(name='jcenter', root='https://jcenter.bintray.com/')
@GrabResolver(name='maven', root='https://repo.maven.apache.org/maven2/')
@Grab('com.github.NemProject:nem.core:v0.6.97')
import org.nem.core.crypto.*
import org.nem.core.model.*

def privKey= ([0,1,2,3]*8) as byte[]
println "privateKey: ${privKey.encodeHex()}"

def sk=new PrivateKey(new BigInteger(privKey))
def kp=new KeyPair(sk)

def pk=kp.publicKey
println "publicKey: ${pk.raw.encodeHex()}"

def addr=Address.fromPublicKey(104 as byte,pk)
println "address: $addr"
