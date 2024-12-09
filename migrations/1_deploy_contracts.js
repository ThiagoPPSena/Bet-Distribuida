const EventManager = artifacts.require("EventManager");

module.exports = async function (deployer) {
  // Deploy EventManager
  deployer.deploy(EventManager);
};
