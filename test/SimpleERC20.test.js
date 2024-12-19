const SimpleERC20 = artifacts.require("SimpleERC20");

contract("SimpleERC20", (accounts) => {
    const [owner, user1, user2] = accounts;

    it("should mint the initial supply to the owner", async () => {
        const instance = await SimpleERC20.deployed();
        const balance = await instance.balanceOf(owner);
        assert.equal(balance.toString(), web3.utils.toWei("1000000", "ether"));
    });

    it("should transfer tokens", async () => {
        const instance = await SimpleERC20.deployed();
        await instance.transfer(user1, web3.utils.toWei("100", "ether"), { from: owner });
        const balance = await instance.balanceOf(user1);
        assert.equal(balance.toString(), web3.utils.toWei("100", "ether"));
    });

    it("should approve and transfer tokens via transferFrom", async () => {
        const instance = await SimpleERC20.deployed();
        await instance.approve(user2, web3.utils.toWei("50", "ether"), { from: user1 });
        await instance.transferFrom(user1, user2, web3.utils.toWei("50", "ether"), { from: user2 });
        const balance = await instance.balanceOf(user2);
        assert.equal(balance.toString(), web3.utils.toWei("50", "ether"));
    });
});
