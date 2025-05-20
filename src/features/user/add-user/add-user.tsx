import Input from "@/components/input/input";
import "./add-user.scss";
import { Card } from "@/components/card/card";
import Dropdown from "@/components/dropdown/dropdown";
import { useEffect, useState } from "react";
import { useHeader } from "@/context/headerContext";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button/button";
const AddUser = () => {
  const { setTitle, setActions, setBreadcrumbs } = useHeader();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    designation: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    setTitle("Add User");
    setActions([
      <Button
        key="cancel"
        text="Cancel"
        onClick={() => navigate("/module")}
        style={{ width: "100px" }}
      />,
      <Button
        key="save"
        text="Save"
        onClick={handleSave}
        style={{ width: "100px" }}
      />,
    ]);
    setBreadcrumbs([
      {
        label: "User Management",
        onClick: () => navigate("/user"),
      },
      {
        label: "Add New User",
        onClick: () => {},
        active: true,
      },
    ]);
  }, [userDetails]);
  const handleSave = () => {
    console.log("Saved data:", userDetails);
  };
  return (
    <>
      <div className="add-user-container">
        <Card header="User Details">
          <div className="user-details-container">
            <Input
              label="Full Name"
              placeholder="Enter Full Name"
              required
              value={userDetails.name}
              onChange={(e) => {
                setUserDetails({ ...userDetails, name: e.target.value });
              }}
            />
            <Input
              label="Email Address"
              placeholder="Enter Email Address"
              required
              value={userDetails.email}
              onChange={(e) => {
                setUserDetails({
                  ...userDetails,
                  phoneNumber: e.target.value,
                });
              }}
            />

            <Input
              label="Phone Number"
              placeholder="Enter Phone Number"
              required
              value={userDetails.phoneNumber}
              onChange={(e) => {
                setUserDetails({
                  ...userDetails,
                  phoneNumber: e.target.value,
                });
              }}
            />
            <Dropdown
              label="Designation"
              name="designation"
              placeholder="Select Designation"
              required
              value={userDetails.designation}
              onChange={(e) => {
                setUserDetails({
                  ...userDetails,
                  designation: e.target.value,
                });
              }}
            />
          </div>
        </Card>
        {/* <Button text="Save" onClick={handleSave} /> */}
      </div>
    </>
  );
};

export default AddUser;
