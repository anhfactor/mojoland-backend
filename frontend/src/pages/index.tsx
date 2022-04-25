// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import { VStack, Heading, Box, LinkOverlay, LinkBox} from "@chakra-ui/layout"
import { Text, Button } from '@chakra-ui/react'
import { useState, useEffect} from 'react'
import {ethers} from "ethers"
import superagent from 'superagent';
import Web3 from 'web3';

declare let window:any


const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainname, setChainName] = useState<string | undefined>()

  useEffect(() => {
    //get ETH balance and network info only when having currentAccount 
    if(!currentAccount || !ethers.utils.isAddress(currentAccount)) return

    //client side code
    if(!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
    }).catch((e)=>console.log(e))

    provider.getNetwork().then((result)=>{
      setChainId(result.chainId)
      setChainName(result.name)
    }).catch((e)=>console.log(e))

  },[currentAccount])

  //click connect
  const onClickConnect = () => {
    //client side code
    if(!window.ethereum) {
      console.log("please install MetaMask")
      return
    }
    //we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.send("eth_requestAccounts", [])
    .then((accounts)=>{
      if(accounts.length>0) setCurrentAccount(accounts[0])
    }).catch((e)=>console.log(e))
  }

  //click disconnect
  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  async function handleSignMessage(publicAddress: any, nonce: any): Promise<{ publicAddress: string; signature: string }> {
    // Define instance of web3
    var web3 = new Web3((window as any).ethereum);
    return new Promise((resolve, reject) =>
      web3.eth.personal.sign(web3.utils.fromUtf8(`Nonce: ${nonce}`), publicAddress, '', (err:any, signature:any) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature });
      })
    );
  }

  // click sign message
  const onClickSignMessage = async () => {
    const serverUrl: string =  'http://localhost:3000'
    await superagent
           .post(`${serverUrl}/api/auth/signup`)
           .send({ address: currentAccount })
           .then(async (dbUser:any) => {
            if (dbUser) {
              const nonce = dbUser.body.data.nonce;
              const signedMessage = await handleSignMessage(currentAccount, nonce);
              console.log("signedMessage")
              console.log(signedMessage)
               if (signedMessage) {
                 await superagent
                   .post(`${serverUrl}/api/auth/signin`)
                   .send({ address: signedMessage.publicAddress, signature: signedMessage.signature })
                   .then(async (newUser:any) => {
                     console.log("JWT")
                     console.log(newUser.body.data)
                   });
               }
            }
          });
  }

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h3"  my={4}>Explore Web3</Heading>          
      <VStack>
        <Box w='100%' my={4}>
        {currentAccount  
          ? <Button type="button" w='100%' onClick={onClickDisconnect}>
                Account:{currentAccount}
            </Button>
          : <Button type="button" w='100%' onClick={onClickConnect}>
                  Connect MetaMask
              </Button>
        }
        </Box>
        {currentAccount  
          ?<Box  mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
          <Heading my={4}  fontSize='xl'>Account info</Heading>
          <Text>Chain Info: ChainId {chainId} name {chainname}</Text>
          <Button  my={4} type="button" w='100%' onClick={onClickSignMessage}>
                  Sign message
          </Button>
          <Button  my={4} type="button" w='100%' onClick={onClickDisconnect}>
                  Disconnect
          </Button>
        </Box>
        :<></>
        }
      </VStack>
    </>
  )
}

export default Home
