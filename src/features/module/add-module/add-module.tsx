import { useCallback, useEffect, useState, useMemo } from "react";
import { useHeader } from "@/context/headerContext";
import "./add-module.scss";
import Button from "@/components/button/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/card/card";
import Input from "@/components/input/input";
const AddModule = () => {
  const { setTitle, setActions, setBreadcrumbs } = useHeader();

  const [moduleDetails, setModuleDetails] = useState({
    name: "",
    linkKeywords: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleSave = useCallback(() => {
    console.log("Saved data:", moduleDetails);
  }, [moduleDetails]);

  useEffect(() => {
    setTitle("New Module");
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
        label: "Modules Management",
        onClick: () => navigate("/module"),
      },
      {
        label: "Add New Module",
        onClick: () => {},
        active: true,
      },
    ]);
  }, [moduleDetails]);

  return (
    <>
      <div className="add-module-container">
        <Card header="Module Details">
          <div className="module-details-container">
            <Input
              label="Module Name"
              placeholder="Enter Module Name"
              required
              value={moduleDetails.name}
              onChange={(e) => {
                setModuleDetails({ ...moduleDetails, name: e.target.value });
              }}
            />
            <Input
              label="Link Keywords"
              placeholder="Enter Link Keywords"
              required
              value={moduleDetails.linkKeywords}
              onChange={(e) => {
                setModuleDetails({
                  ...moduleDetails,
                  linkKeywords: e.target.value,
                });
              }}
            />
          </div>
          <Input
            label="Description"
            placeholder="Enter Description"
            textArea
            style={{ resize: "none" }}
            required
            value={moduleDetails.description}
            onChange={(e) => {
              setModuleDetails({
                ...moduleDetails,
                description: e.target.value,
              });
            }}
          />
        </Card>
        {/* <Button text="Save" onClick={handleSave} /> */}
      </div>
    </>
  );
};

export default AddModule;
