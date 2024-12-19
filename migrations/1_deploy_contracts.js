const SimpleERC20 = artifacts.require("SimpleERC20");

module.exports = function (deployer) {
    deployer.deploy(SimpleERC20, 1000000 * (10 ** 18));
};
