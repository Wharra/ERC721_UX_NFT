const FakeBAYC = artifacts.require("FakeBAYC");
const FakeNefturians = artifacts.require("FakeNefturians");

module.exports = function (deployer) {
  deployer.deploy(FakeBAYC);
  deployer.deploy(FakeNefturians);
};
