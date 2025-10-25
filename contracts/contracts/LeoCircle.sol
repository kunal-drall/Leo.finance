// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LeoCore.sol";

/**
 * @title LeoCircle
 * @notice ROSCA (Rotating Savings and Credit Association) implementation
 * @dev Manages circle lifecycle, contributions, and payouts
 */
contract LeoCircle is ReentrancyGuard {
    // Circle states
    enum CircleState {
        Pending,    // Waiting for members
        Active,     // Accepting contributions
        Completed,  // All rounds finished
        Cancelled   // Circle cancelled
    }

    // Member struct
    struct Member {
        address memberAddress;
        bool hasPaid;
        bool hasReceivedPayout;
        uint256 contributionAmount;
        uint256 joinedAt;
    }

    // Circle configuration
    LeoCore public immutable leoCore;
    address public creator;
    uint256 public circleId;
    uint256 public contributionAmount;
    uint256 public contributionFrequency; // in seconds
    uint256 public maxMembers;
    uint256 public startTime;
    CircleState public state;

    // PYUSD token (for production, this would be the actual PYUSD address)
    IERC20 public paymentToken;

    // Members
    address[] public membersList;
    mapping(address => Member) public members;
    mapping(address => bool) public isMember;

    // Payout tracking
    uint256 public currentRound;
    address[] public payoutQueue;
    uint256 public nextPayoutIndex;

    // Events
    event MemberJoined(address indexed member, uint256 timestamp);
    event ContributionMade(
        address indexed member,
        uint256 amount,
        uint256 round
    );
    event PayoutDistributed(
        address indexed recipient,
        uint256 amount,
        uint256 round
    );
    event CircleStateChanged(CircleState newState);

    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }

    modifier onlyActiveMember() {
        require(isMember[msg.sender], "Not a member");
        require(state == CircleState.Active, "Circle not active");
        _;
    }

    constructor(
        address _leoCore,
        address _creator,
        uint256 _contributionAmount,
        uint256 _contributionFrequency,
        uint256 _maxMembers,
        address _paymentToken
    ) {
        leoCore = LeoCore(_leoCore);
        creator = _creator;
        contributionAmount = _contributionAmount;
        contributionFrequency = _contributionFrequency;
        maxMembers = _maxMembers;
        paymentToken = IERC20(_paymentToken);
        state = CircleState.Pending;

        // Register circle with LeoCore
        circleId = leoCore.registerCircle(
            address(this),
            _creator,
            _contributionAmount,
            _contributionFrequency
        );

        // Add creator as first member
        _addMember(_creator);
    }

    /**
     * @notice Join the circle
     */
    function joinCircle() external nonReentrant {
        require(state == CircleState.Pending, "Circle not accepting members");
        require(!isMember[msg.sender], "Already a member");
        require(membersList.length < maxMembers, "Circle full");

        _addMember(msg.sender);
        leoCore.addUserToCircle(circleId, msg.sender);
    }

    /**
     * @notice Start the circle (creator only)
     */
    function startCircle() external onlyCreator {
        require(state == CircleState.Pending, "Circle already started");
        require(membersList.length >= 2, "Need at least 2 members");

        state = CircleState.Active;
        startTime = block.timestamp;
        currentRound = 1;

        // Initialize payout queue
        payoutQueue = membersList;

        emit CircleStateChanged(CircleState.Active);
    }

    /**
     * @notice Make a contribution for the current round
     */
    function contribute() external onlyActiveMember nonReentrant {
        Member storage member = members[msg.sender];
        require(!member.hasPaid, "Already contributed this round");

        // Transfer PYUSD from user
        require(
            paymentToken.transferFrom(
                msg.sender,
                address(this),
                contributionAmount
            ),
            "Transfer failed"
        );

        member.hasPaid = true;
        member.contributionAmount += contributionAmount;

        emit ContributionMade(msg.sender, contributionAmount, currentRound);

        // Check if all members have contributed
        if (_allMembersPaid()) {
            _distributePayout();
        }
    }

    /**
     * @notice Get circle info
     */
    function getCircleInfo()
        external
        view
        returns (
            CircleState _state,
            uint256 _currentRound,
            uint256 _totalMembers,
            uint256 _contributionAmount,
            uint256 _startTime
        )
    {
        return (
            state,
            currentRound,
            membersList.length,
            contributionAmount,
            startTime
        );
    }

    /**
     * @notice Get member info
     */
    function getMemberInfo(address _member)
        external
        view
        returns (
            bool _isMember,
            bool _hasPaid,
            bool _hasReceivedPayout,
            uint256 _totalContributed
        )
    {
        Member memory member = members[_member];
        return (
            isMember[_member],
            member.hasPaid,
            member.hasReceivedPayout,
            member.contributionAmount
        );
    }

    /**
     * @notice Get all members
     */
    function getMembers() external view returns (address[] memory) {
        return membersList;
    }

    // Internal functions

    function _addMember(address _member) internal {
        membersList.push(_member);
        isMember[_member] = true;
        members[_member] = Member({
            memberAddress: _member,
            hasPaid: false,
            hasReceivedPayout: false,
            contributionAmount: 0,
            joinedAt: block.timestamp
        });

        emit MemberJoined(_member, block.timestamp);
    }

    function _allMembersPaid() internal view returns (bool) {
        for (uint256 i = 0; i < membersList.length; i++) {
            if (!members[membersList[i]].hasPaid) {
                return false;
            }
        }
        return true;
    }

    function _distributePayout() internal {
        require(nextPayoutIndex < payoutQueue.length, "All payouts completed");

        address recipient = payoutQueue[nextPayoutIndex];
        uint256 payoutAmount = contributionAmount * membersList.length;

        // Mark as received payout
        members[recipient].hasReceivedPayout = true;

        // Transfer payout
        require(
            paymentToken.transfer(recipient, payoutAmount),
            "Payout transfer failed"
        );

        emit PayoutDistributed(recipient, payoutAmount, currentRound);

        // Reset for next round
        for (uint256 i = 0; i < membersList.length; i++) {
            members[membersList[i]].hasPaid = false;
        }

        nextPayoutIndex++;
        currentRound++;

        // Check if circle is completed
        if (nextPayoutIndex >= payoutQueue.length) {
            state = CircleState.Completed;
            emit CircleStateChanged(CircleState.Completed);
        }
    }
}
