import React,{ useState } from 'react'
import './App.css'
import { Typography, Button, Stack, TextField } from '@mui/material';
import { abi,contractAddress,provider } from './contract/interaction';
import { ethers } from 'ethers';

function App() {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const Provider = new ethers.providers.Web3Provider(window.ethereum);
  const [newAccBal, setNewBal] = useState('');
  const [addAccBal, setAddBal] = useState('');
  const [witAccBal, setWitBal] = useState('');
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [bal, setBal] = useState('');

  const connectWallet = async () => {
    try {
      await Provider.send("eth_requestAccounts", []);
     setWalletConnected(true);
    } catch (error) {
      console.log(error.error)
    }
    
  }

  const accountdetails = async () => {
    const Signer = Provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, Signer);
    const getAccount = await contract.getAccount();
    setAddress(getAccount[0]);
    setBal(ethers.utils.formatEther(getAccount[1]));
   // console.log(ethers.utils.formatEther(getAccount[1]));

    
  }



  const addNewAccount = async () => {
    setError('');
    const Signer = Provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, Signer);
   
    let overrides = {
      value: ethers.utils.parseEther(newAccBal)
    }
    try{
      await contract.addAccount(overrides);
    } catch (error) {
      setError(error.error.message);
      console.log(error.error);
    }
  }

  const addBalance = async () => {
    setError('');
    const Signer = Provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, Signer);
    
    let overrides = {
      value: ethers.utils.parseEther(addAccBal)
    }
    try{
      await contract.addBalance(overrides);

    } catch (error) {
      try {
        setError(error.error.message)
      } catch (error) {
        setError(error.code)
      }
     
    }

  }

  const withdrawBalance = async () => {
    setError('');
    const Signer = Provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, Signer);
    
    try {
      const witbal = ethers.utils.parseEther(witAccBal);
      await contract.withdraw(witbal);

    } catch (error) {
      try {
        setError(error.error.message)
      } catch (error) {
        setError(error.code)
      }
     
    }
  }

  
  const checkConnectivity = () => {
   
    if (isWalletConnected == true) {
      {accountdetails()}
      return (
        <div>
          <Typography sx={{ color: 'green' }}>Wallet Connected</Typography>
          <Typography sx={{ color: 'red' }}>{error}</Typography>
          <Stack sx={{backgroundColor:'#000',mt:5,borderRadius:5}}>
            <Typography variant='h6' sx={{ color: '#fff' }}>Address: {address}</Typography>
            <Typography sx={{ color: '#fff' }}>Account Balance: {bal} ETH</Typography>
          </Stack>

          <Stack sx={{ mt: 10, alignItems: 'center' }}>
        <Typography variant='h4' color='#000'>Open new Account:</Typography>
        <TextField label='Enter the amount of ETH you want to add in your account' variant='outlined' placeholder='Enter Amount in ETH' sx={{width:600,m:1}} type={'number'} onChange={(text)=>{setNewBal(text.target.value)}} />
        <Button variant='outlined' sx={{width:'20%',mt:1}} onClick={()=>{addNewAccount()}} >Add Account</Button>
      </Stack>

      <Stack sx={{mt:15,alignItems:'center'}}>
        <Typography variant='h4' color='#000'>Add Balance to existing Account:</Typography>
        <TextField label='Enter the amount of ETH you want to add in your account' variant='outlined' placeholder='Enter Amount in ETH' sx={{width:600,m:1}} type={'number'} onChange={(text)=>{setAddBal(text.target.value)}}  />
        <Button variant='outlined' sx={{width:'20%',mt:1}} onClick={()=>{addBalance()}} >Add Balance</Button>
      </Stack>

      <Stack sx={{mt:15,alignItems:'center'}}>
        <Typography variant='h4' color='#000'>Withdraw Balance from your Account:</Typography>
        <TextField label='Enter the amount of ETH you want to add in your account' variant='outlined' placeholder='Enter Amount in ETH' sx={{width:600,m:1}} type={'number'} onChange={(text)=>{setWitBal(text.target.value)}} />
        <Button variant='outlined' sx={{width:'21%',mt:1}} onClick={()=>{withdrawBalance()}} >Withdraw Balance</Button>
      </Stack>
      </div>
      )
    } else {
      return (
        <div>
          <Button variant='outlined' sx={{mt:10}} onClick={()=>{connectWallet()}}>Connect Wallet</Button>
        </div>
      )
    }
  }





  return (
    <div>
      <Stack>
        <Typography variant='h3' color='#000'>Bank DApp</Typography>
      </Stack>
     {checkConnectivity()}

   </div>
  )
}

export default App
