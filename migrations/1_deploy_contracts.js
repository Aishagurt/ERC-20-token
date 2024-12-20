const SimpleERC20 = artifacts.require("SimpleERC20");

module.exports = function (deployer) {
    const initialSupply = web3.utils.toWei("1000000", "ether");
    deployer.deploy(SimpleERC20, initialSupply);
};