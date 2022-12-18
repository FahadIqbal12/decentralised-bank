// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract simpleBank{
 address public bankAddress;
 uint256 private accountCounter;
 
 constructor(){
     accountCounter = 0;
     bankAddress = msg.sender;
 }

 struct account {
     address accountAddress;
     uint256 accountId;
     uint256 accountBalance;
 }

 event accountCreated (
     address accountAddress,
     uint256 accountId,
     uint256 accountBalance
 );

 mapping(address => account ) Accounts;



function addAccount() public payable {
    account storage acc = Accounts[msg.sender];
    require(msg.sender != acc.accountAddress,"You already have an account");
    require(msg.value > (0.05 ether),"Your balance must be greater than 0.05 ether" );

    account storage newAccount = Accounts[msg.sender];
    newAccount.accountAddress = msg.sender;
    newAccount.accountId = accountCounter;
    newAccount.accountBalance = msg.value;

    

    emit accountCreated(msg.sender,accountCounter,msg.value);
    accountCounter++;


}

function addBalance() public payable{
    account storage acc = Accounts[msg.sender];
    require(msg.sender == acc.accountAddress,"You do not have an account");
    acc.accountBalance = acc.accountBalance+msg.value;

}

function withdraw(uint256 witbal) external payable{
    account storage acc = Accounts[msg.sender];
    require(msg.sender == acc.accountAddress,"You do not have an account");
    require(msg.value <= acc.accountBalance,"Insuffiecient amount");
    acc.accountBalance = acc.accountBalance-witbal;
    
    payable(msg.sender).transfer(witbal);
}

function getAccount() public view returns(address,uint256) {
    account storage acc = Accounts[msg.sender];
    return(acc.accountAddress,acc.accountBalance);

}



}