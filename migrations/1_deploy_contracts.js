const EventManager = artifacts.require("EventManager");
const Betting = artifacts.require("Betting");

module.exports = async function (deployer) {
  // Deploy EventManager
  await deployer.deploy(EventManager);
  // Obtem o deployed EventManager instance
  const eventManagerInstance = await EventManager.deployed();
  // Deploy Betting
  await deployer.deploy(Betting, eventManagerInstance.address);
};
