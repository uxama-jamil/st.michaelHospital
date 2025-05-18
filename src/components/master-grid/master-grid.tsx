import React, { useEffect } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CPagination,
  CPaginationItem,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilArrowRight, cilReload } from "@coreui/icons";
import "./master-grid.scss";

// Custom badge for status
const StatusBadge = ({ status }) => {
  let color = "secondary";
  if (status === "Published" || status === "Active") color = "success";
  else if (status === "Save as Draft" || status === "Inactive")
    color = "warning";
  return (
    <CBadge
      className="master-badge"
      color={color}
      style={{
        fontWeight: 500,
        fontSize: 14,
        padding: "7px 10px",
        borderRadius: 100,
      }}
    >
      {status}
    </CBadge>
  );
};

// Custom chip/tag for keywords
const KeywordChip = ({ label }) => (
  <CBadge
    color="light"
    textColor="dark"
    style={{
      fontWeight: 500,
      fontSize: 13,
      marginRight: 6,
      borderRadius: 100,
      padding: "7px 10px",
    }}
  >
    {label}
  </CBadge>
);

const MasterGrid = ({
  columns,
  data,
  actions,
  pagination,
  children = null,
}) => {
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div className="master-grid-container">
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead className="bg-light">
          <CTableRow>
            {columns.map((col) => (
              <CTableHeaderCell
                key={col.key}
                style={{ fontWeight: 600, fontSize: 15 }}
              >
                {col.label}
              </CTableHeaderCell>
            ))}
            {actions && (
              <CTableHeaderCell style={{ fontWeight: 600, fontSize: 15 }}>
                Action
              </CTableHeaderCell>
            )}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data.length > 0
            ? data.map((row, idx) => (
                <CTableRow key={idx}>
                  {columns.map((col) => (
                    <CTableDataCell key={col.key} style={{ fontSize: 15 }}>
                      {col.render
                        ? col.render(row[col.key], row)
                        : Array.isArray(row[col.key])
                        ? row[col.key].map((item, i) => (
                            <KeywordChip key={i} label={item} />
                          ))
                        : row[col.key]}
                    </CTableDataCell>
                  ))}
                  {actions && (
                    <CTableDataCell>
                      {actions.map((action, i) => (
                        <CButton
                          key={i}
                          color="light"
                          size="sm"
                          style={{
                            marginRight: 8,
                            borderRadius: 6,
                            boxShadow: "none",
                          }}
                          onClick={() => action.onClick(row)}
                        >
                          {action.icon}
                          {action.label && (
                            <span style={{ marginLeft: 4 }}>
                              {action.label}
                            </span>
                          )}
                        </CButton>
                      ))}
                    </CTableDataCell>
                  )}
                </CTableRow>
              ))
            : children}
        </CTableBody>
      </CTable>
      {/* Pagination */}
      {pagination && (
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <CPagination align="end">
            <CPaginationItem
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(1)}
            >
              &lt;&lt;
            </CPaginationItem>
            <CPaginationItem
              disabled={pagination.currentPage === 1}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
            >
              &lt;
            </CPaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <CPaginationItem
                key={i}
                active={pagination.currentPage === i + 1}
                onClick={() => pagination.onPageChange(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
            >
              &gt;
            </CPaginationItem>
            <CPaginationItem
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.totalPages)}
            >
              &gt;&gt;
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </div>
  );
};

export { StatusBadge, KeywordChip };
export default MasterGrid;
