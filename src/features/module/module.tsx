import React from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CImage,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import MasterGrid from "@component/master-grid/master-grid";

const modulesData = [
  {
    name: "Pelvic Floor Physiotherapy",
    createdBy: "Leslie Alexander",
    resources: 5,
    keywords: ["Endometriosis"],
    extraKeywords: 3,
    status: "Published",
  },
  {
    name: "Diet",
    createdBy: "Dianne Russell",
    resources: 12,
    keywords: ["NHS", "TTC"],
    extraKeywords: 3,
    status: "Published",
  },
  {
    name: "Movement",
    createdBy: "Darlene Robertson",
    resources: 23,
    keywords: ["IVF", "NHS"],
    extraKeywords: 2,
    status: "Draft",
  },
  {
    name: "Mindfulness Course",
    createdBy: "Annette Black",
    resources: 9,
    keywords: ["Mindfulness", "IVF"],
    extraKeywords: 0,
    status: "Published",
  },
  {
    name: "Endometriosis",
    createdBy: "Brooklyn Simmons",
    resources: 9,
    keywords: ["Endometriosis"],
    extraKeywords: 0,
    status: "Published",
  },
  {
    name: "Meditation",
    createdBy: "Kristin Watson",
    resources: 9,
    keywords: ["Lifestyle"],
    extraKeywords: 8,
    status: "Draft",
  },
];
import GenericGrid, { StatusBadge, KeywordChip } from "@component/GenericGrid";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilArrowRight, cilReload } from "@coreui/icons";
import { Questions } from "@/features/module/content/add-content/questions/questions";
import { Card } from "@components/card/card";
import "./module.scss";
import { Empty } from "@/components/empty/empty";

const columns = [
  { key: "name", label: "Playlist Name" },
  { key: "createdBy", label: "Created by" },
  { key: "totalResources", label: "Total Resources" },
  {
    key: "keywords",
    label: "Keyword",
    render: (value) =>
      value.map((kw, i) =>
        typeof kw === "string" ? (
          <KeywordChip key={i} label={kw} />
        ) : (
          <KeywordChip key={i} label={kw.label} />
        )
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (value) => <StatusBadge status={value} />,
  },
];
const data = [
  {
    name: "Playlist 1",
    createdBy: "Leslie Alexander",
    totalResources: "05",
    keywords: [{ label: "Endometriosis" }, { label: "+3" }],
    status: "Published",
  },
  {
    name: "Playlist 2",
    createdBy: "Dianne Russell",
    totalResources: "12",
    keywords: [{ label: "NHS" }, { label: "TTC" }, { label: "+3" }],
    status: "Published",
  },
  {
    name: "Playlist 3",
    createdBy: "Darlene Robertson",
    totalResources: "23",
    keywords: [{ label: "IVF" }, { label: "NHS" }, { label: "+2" }],
    status: "Save as Draft",
  },
];

const actions = [
  {
    icon: <CIcon icon={cilPencil} />,
    onClick: (row) => alert(`Edit ${row.name}`),
  },
  {
    icon: <CIcon icon={cilTrash} />,
    onClick: (row) => alert(`Delete ${row.name}`),
  },
  {
    icon: <CIcon icon={cilArrowRight} />,
    onClick: (row) => alert(`View ${row.name}`),
  },
];

const pagination = {
  currentPage: 1,
  totalPages: 3,
  onPageChange: (page) => alert(`Go to page ${page}`),
};

const ModulesManagement = () => {
  return (
    <div className="card-sample">
      {/* <Card header={"Questionnaire details"}>
       
        <Empty
          heading={"No question added yet"}
          message={"Start managing your question by adding your first one."}
          buttonText={"Add New Question"}
          onClick={() => {}}
          btnStyle={{ width: "20%", padding: "16px" }}
        />
      </Card> */}
      <MasterGrid
        columns={columns}
        data={data}
        actions={actions}
        pagination={pagination}
      >
        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "50%",
            margin: "0 auto",
          }}
        > */}
        <Empty
          heading={"No question added yet"}
          message={"Start managing your question by adding your first one."}
          buttonText={"Add New Question"}
          onClick={() => {}}
        ></Empty>
        {/* </div> */}
      </MasterGrid>
    </div>
  );
};

export default ModulesManagement;
