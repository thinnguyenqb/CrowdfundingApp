pragma solidity ^0.4.17;

contract CampaignFactory {
    // ==== Fields ====
    address[] public deployedCampaigns;

    // ==== Modifier ====
    // ==== create a new contract ====
    function createCampaign(
        uint256 minimum,
        string name,
        string description,
        string image,
        uint256 target
    ) public {
        address newCampaign = new Campaign(minimum, msg.sender, name, description, image, target);
        deployedCampaigns.push(newCampaign);
    }

    // ==== returning all the address of the deployed contract
    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // collection of key value pairs
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    // === Fields ===
    Request[] public requests;
    address public manager;
    uint256 public minimunContribution;
    string public CampaignName;
    string public CampaignDescription;
    string public imageUrl;
    uint256 public targetToAchieve;
    address[] public contributers;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    // === Methods ===
    
    // == Modifier ==
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    // == constructor ==
    //Setting the manager and minimum amount to contribute
    function Campaign(
        uint256 minimun,
        address creator,
        string name,
        string description,
        string image,
        uint256 target
    ) public {
        manager = creator;
        minimunContribution = minimun;
        CampaignName = name;
        CampaignDescription = description;
        imageUrl = image;
        targetToAchieve = target;
    }

    //donate money to compaign and became an approver
    function contibute() public payable {
        require(msg.value >= minimunContribution);

        if(approvers[msg.sender]!= true){    
            contributers.push(msg.sender);
            approvers[msg.sender] = true;
            approversCount++;
        }
    }

    //creating a new request by the manager
    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    //approving a particular request by the user
    function approveRequest(uint256 index) public {
         Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        require(!request.complete);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    //final approval of request by the manager and sending the amount
    function finalizeRequest(uint256 index) public restricted {
        require(requests[index].approvalCount > (approversCount / 2));
        require(!requests[index].complete);

        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;
    }

    // function to retrieve Campaign balance, minimumContribution , no of requests , no of Contributors and manager address
    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string,
            string,
            string,
            uint256
        )
    {
        return (
            minimunContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            CampaignName,
            CampaignDescription,
            imageUrl,
            targetToAchieve
        );
    }

    // returing no of requests
    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
