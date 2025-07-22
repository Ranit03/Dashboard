// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title ExplorerRegistry
 * @dev Registry contract for BlockDAG Scan++ explorer features
 * @notice This contract manages verified contracts, labels, and explorer metadata
 */
contract ExplorerRegistry is Ownable, ReentrancyGuard, Pausable {
    
    struct ContractInfo {
        string name;
        string version;
        string sourceCode;
        string abi;
        address deployer;
        uint256 deploymentBlock;
        bool isVerified;
        bool isProxy;
        address implementation;
        string[] tags;
    }
    
    struct AddressLabel {
        string label;
        string category; // "exchange", "defi", "nft", "bridge", etc.
        string description;
        bool isVerified;
        address submitter;
        uint256 timestamp;
    }
    
    struct PluginInfo {
        string name;
        string version;
        string ipfsHash;
        address developer;
        bool isActive;
        uint256 installCount;
        mapping(address => bool) installedBy;
    }
    
    // Events
    event ContractVerified(address indexed contractAddress, string name, string version);
    event ContractUpdated(address indexed contractAddress, string name, string version);
    event LabelAdded(address indexed targetAddress, string label, string category);
    event LabelUpdated(address indexed targetAddress, string label, string category);
    event PluginRegistered(string indexed pluginId, string name, address developer);
    event PluginInstalled(string indexed pluginId, address indexed user);
    event PluginUninstalled(string indexed pluginId, address indexed user);
    
    // State variables
    mapping(address => ContractInfo) public contracts;
    mapping(address => AddressLabel) public addressLabels;
    mapping(string => PluginInfo) public plugins;
    mapping(address => bool) public verifiers;
    mapping(address => string[]) public userInstalledPlugins;
    
    string[] public allPluginIds;
    address[] public verifiedContracts;
    address[] public labeledAddresses;
    
    uint256 public verificationFee = 0.01 ether;
    uint256 public labelSubmissionFee = 0.001 ether;
    
    modifier onlyVerifier() {
        require(verifiers[msg.sender] || msg.sender == owner(), "Not authorized verifier");
        _;
    }
    
    constructor() Ownable(msg.sender) {
        verifiers[msg.sender] = true;
    }
    
    /**
     * @dev Verify a smart contract with metadata
     */
    function verifyContract(
        address contractAddress,
        string memory name,
        string memory version,
        string memory sourceCode,
        string memory abi,
        bool isProxy,
        address implementation,
        string[] memory tags
    ) external payable onlyVerifier whenNotPaused {
        require(contractAddress != address(0), "Invalid contract address");
        require(bytes(name).length > 0, "Name required");
        require(bytes(sourceCode).length > 0, "Source code required");
        
        if (msg.sender != owner()) {
            require(msg.value >= verificationFee, "Insufficient verification fee");
        }
        
        ContractInfo storage info = contracts[contractAddress];
        info.name = name;
        info.version = version;
        info.sourceCode = sourceCode;
        info.abi = abi;
        info.deployer = msg.sender;
        info.deploymentBlock = block.number;
        info.isVerified = true;
        info.isProxy = isProxy;
        info.implementation = implementation;
        info.tags = tags;
        
        if (!_isContractInArray(contractAddress)) {
            verifiedContracts.push(contractAddress);
        }
        
        emit ContractVerified(contractAddress, name, version);
    }
    
    /**
     * @dev Add or update an address label
     */
    function addAddressLabel(
        address targetAddress,
        string memory label,
        string memory category,
        string memory description
    ) external payable whenNotPaused {
        require(targetAddress != address(0), "Invalid address");
        require(bytes(label).length > 0, "Label required");
        
        if (msg.sender != owner() && !verifiers[msg.sender]) {
            require(msg.value >= labelSubmissionFee, "Insufficient label fee");
        }
        
        AddressLabel storage addressLabel = addressLabels[targetAddress];
        bool isNewLabel = bytes(addressLabel.label).length == 0;
        
        addressLabel.label = label;
        addressLabel.category = category;
        addressLabel.description = description;
        addressLabel.isVerified = verifiers[msg.sender] || msg.sender == owner();
        addressLabel.submitter = msg.sender;
        addressLabel.timestamp = block.timestamp;
        
        if (isNewLabel) {
            labeledAddresses.push(targetAddress);
            emit LabelAdded(targetAddress, label, category);
        } else {
            emit LabelUpdated(targetAddress, label, category);
        }
    }
    
    /**
     * @dev Register a new plugin
     */
    function registerPlugin(
        string memory pluginId,
        string memory name,
        string memory version,
        string memory ipfsHash
    ) external whenNotPaused {
        require(bytes(pluginId).length > 0, "Plugin ID required");
        require(bytes(name).length > 0, "Plugin name required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(plugins[pluginId].developer == address(0), "Plugin already exists");
        
        PluginInfo storage plugin = plugins[pluginId];
        plugin.name = name;
        plugin.version = version;
        plugin.ipfsHash = ipfsHash;
        plugin.developer = msg.sender;
        plugin.isActive = true;
        plugin.installCount = 0;
        
        allPluginIds.push(pluginId);
        
        emit PluginRegistered(pluginId, name, msg.sender);
    }
    
    /**
     * @dev Install a plugin for the user
     */
    function installPlugin(string memory pluginId) external whenNotPaused {
        require(plugins[pluginId].developer != address(0), "Plugin does not exist");
        require(plugins[pluginId].isActive, "Plugin is not active");
        require(!plugins[pluginId].installedBy[msg.sender], "Plugin already installed");
        
        plugins[pluginId].installedBy[msg.sender] = true;
        plugins[pluginId].installCount++;
        userInstalledPlugins[msg.sender].push(pluginId);
        
        emit PluginInstalled(pluginId, msg.sender);
    }
    
    /**
     * @dev Uninstall a plugin for the user
     */
    function uninstallPlugin(string memory pluginId) external {
        require(plugins[pluginId].installedBy[msg.sender], "Plugin not installed");
        
        plugins[pluginId].installedBy[msg.sender] = false;
        plugins[pluginId].installCount--;
        
        // Remove from user's installed plugins array
        string[] storage userPlugins = userInstalledPlugins[msg.sender];
        for (uint256 i = 0; i < userPlugins.length; i++) {
            if (keccak256(bytes(userPlugins[i])) == keccak256(bytes(pluginId))) {
                userPlugins[i] = userPlugins[userPlugins.length - 1];
                userPlugins.pop();
                break;
            }
        }
        
        emit PluginUninstalled(pluginId, msg.sender);
    }
    
    // View functions
    function getContractInfo(address contractAddress) external view returns (ContractInfo memory) {
        return contracts[contractAddress];
    }
    
    function getAddressLabel(address targetAddress) external view returns (AddressLabel memory) {
        return addressLabels[targetAddress];
    }
    
    function getUserInstalledPlugins(address user) external view returns (string[] memory) {
        return userInstalledPlugins[user];
    }
    
    function isPluginInstalledByUser(string memory pluginId, address user) external view returns (bool) {
        return plugins[pluginId].installedBy[user];
    }
    
    function getVerifiedContractsCount() external view returns (uint256) {
        return verifiedContracts.length;
    }
    
    function getLabeledAddressesCount() external view returns (uint256) {
        return labeledAddresses.length;
    }
    
    function getAllPluginIds() external view returns (string[] memory) {
        return allPluginIds;
    }
    
    // Admin functions
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }
    
    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
    }
    
    function setVerificationFee(uint256 newFee) external onlyOwner {
        verificationFee = newFee;
    }
    
    function setLabelSubmissionFee(uint256 newFee) external onlyOwner {
        labelSubmissionFee = newFee;
    }
    
    function deactivatePlugin(string memory pluginId) external onlyOwner {
        plugins[pluginId].isActive = false;
    }
    
    function activatePlugin(string memory pluginId) external onlyOwner {
        plugins[pluginId].isActive = true;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Internal functions
    function _isContractInArray(address contractAddress) internal view returns (bool) {
        for (uint256 i = 0; i < verifiedContracts.length; i++) {
            if (verifiedContracts[i] == contractAddress) {
                return true;
            }
        }
        return false;
    }
}
