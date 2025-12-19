const FakeMeebits = artifacts.require(
  "./FakeMeebits.sol"
);
const FakeMeebitsClaimer = artifacts.require(
  "./FakeMeebitsClaimer.sol"
);

async function doDeploy(deployer, network, accounts) {

  const FakeMeebitsContract = await deployer.deploy(
    FakeMeebits
  );

  const FakeMeebitsClaimerContract = await deployer.deploy(
    FakeMeebitsClaimer,
    20000,
    FakeMeebitsContract.address
  );
  // Declare FakeMeebitsClaimer as minter for ERC721
  await FakeMeebitsContract.manageMinter(FakeMeebitsClaimerContract.address, true);

}

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    await doDeploy(deployer, network, accounts);
  });
};
