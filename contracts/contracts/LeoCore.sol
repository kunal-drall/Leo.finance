// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LeoCore
 * @notice Core contract for Leo Finance protocol
 * @dev Manages circle creation, global parameters, and access control
 */
contract LeoCore is Ownable, ReentrancyGuard {
    // Circle counter
    uint256 private _circleCounter;

    // Mapping of circle ID to circle address
    mapping(uint256 => address) public circles;

    // Mapping of address to array of circle IDs they're in
    mapping(address => uint256[]) public userCircles;

    // Protocol fee (in basis points, e.g., 100 = 1%)
    uint256 public protocolFeeBps = 100;

    // Minimum contribution amount (in wei)
    uint256 public minContribution = 0.01 ether;

    // Maximum members per circle
    uint256 public maxMembersPerCircle = 50;

    // Events
    event CircleCreated(
        uint256 indexed circleId,
        address indexed circleAddress,
        address indexed creator,
        uint256 contributionAmount,
        uint256 duration
    );

    event CircleJoined(
        uint256 indexed circleId,
        address indexed user
    );

    event ProtocolFeeUpdated(uint256 newFeeBps);
    event MinContributionUpdated(uint256 newMinContribution);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Get total number of circles created
     */
    function getTotalCircles() external view returns (uint256) {
        return _circleCounter;
    }

    /**
     * @notice Get all circles a user is participating in
     * @param user Address of the user
     */
    function getUserCircles(address user) external view returns (uint256[] memory) {
        return userCircles[user];
    }

    /**
     * @notice Update protocol fee
     * @param newFeeBps New fee in basis points
     */
    function updateProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }

    /**
     * @notice Update minimum contribution
     * @param newMinContribution New minimum contribution amount
     */
    function updateMinContribution(uint256 newMinContribution) external onlyOwner {
        minContribution = newMinContribution;
        emit MinContributionUpdated(newMinContribution);
    }

    /**
     * @notice Register a circle (called by circle contract)
     * @param circleAddress Address of the circle contract
     * @param creator Creator of the circle
     */
    function registerCircle(
        address circleAddress,
        address creator,
        uint256 contributionAmount,
        uint256 duration
    ) external returns (uint256) {
        _circleCounter++;
        uint256 circleId = _circleCounter;

        circles[circleId] = circleAddress;
        userCircles[creator].push(circleId);

        emit CircleCreated(
            circleId,
            circleAddress,
            creator,
            contributionAmount,
            duration
        );

        return circleId;
    }

    /**
     * @notice Add user to circle mapping
     * @param circleId Circle ID
     * @param user User address
     */
    function addUserToCircle(uint256 circleId, address user) external {
        require(circles[circleId] == msg.sender, "Not authorized");
        userCircles[user].push(circleId);
        emit CircleJoined(circleId, user);
    }
}
