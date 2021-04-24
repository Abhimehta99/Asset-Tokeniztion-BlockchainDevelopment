const Token = artifacts.require("./MyToken.sol");
require('dotenv').config({path: '../.env'});

const chai= require("./chaisetup.js");
const BN = web3.utils.BN;
const expect =chai.expect;

contract("Token Test", async accounts =>{
    const[initialHolder, recipient, anotherAccount]= accounts;

    beforeEach(async()=>{
        //sets the number of token to 1000 before each test is performed
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    });

    it("All tokens should be in my account", async()=>{
        let instance=this.myToken;
        let totalSupply=await instance.totalSupply();

        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send tokens form account 1 to account 2", async()=>{
        const sendTokens = 1; 
        let instance = this.myToken;
        let totalSupply=await instance.totalSupply();
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("It's not possible to send more tokens than account 1 has", async()=>{
        let instance=this.myToken;
        let balanceOfAccount=await instance.balanceOf(initialHolder);

        expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.bignumber.equal(balanceOfAccount);
    });
});