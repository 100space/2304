pragma solidity ^8.0.0;

contract Count {
    unit256 value;

    function getValue() public view returns(unit256){
        return value   
    }

    function setValue(unit256 _value) public {
        value = _value
    }
}