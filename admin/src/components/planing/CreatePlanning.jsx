import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Table, message } from "antd";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import api from "../../configs/axios";
import "./CreatePlanning.css";
import create1 from "../../assets/images/create1.png";

// ================ CONSTANTS ================
const initialStage = () => ({
  weeks: [{ week: "", cigarettes: "" }],
});

const LOCAL_KEY = "quitcare_planning_draft";

// ================ MAIN COMPONENT ================
function CreatePlanning() {
  // ================ STATE MANAGEMENT ================
  const [stages, setStages] = useState([initialStage()]);
  const [mode, setMode] = useState("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const accountId = localStorage.getItem("accountId");
  const quitPlanId = localStorage.getItem("quitPlanId");

  // ================ VALIDATION FUNCTIONS ================
  const validateWeekFormat = (weekValue) => {
    if (!weekValue || weekValue.trim() === "") {
      return "Vui lòng nhập khoảng thời gian";
    }

    // Các pattern hợp lệ
    const patterns = [
      /^Tuần\s+\d+\s*-\s*\d+$/i, // Tuần 1 - 2, Tuần 3-5
      /^Tuần\s+\d+$/i, // Tuần 1, Tuần 5
      /^Tuần\s+\d+\s*đến\s*\d+$/i, // Tuần 1 đến 3
      /^Tuần\s+\d+\s*-\s*Tuần\s+\d+$/i, // Tuần 1 - Tuần 3
    ];

    const isValid = patterns.some((pattern) => pattern.test(weekValue.trim()));

    if (!isValid) {
      return "Định dạng không hợp lệ. Ví dụ: 'Tuần 1 - 2', 'Tuần 3', 'Tuần 1 đến 3'";
    }

    // Kiểm tra logic số tuần
    const weekNumbers = weekValue.match(/\d+/g);
    if (weekNumbers && weekNumbers.length === 2) {
      const start = parseInt(weekNumbers[0]);
      const end = parseInt(weekNumbers[1]);
      if (start >= end) {
        return "Tuần bắt đầu phải nhỏ hơn tuần kết thúc";
      }
      if (start < 1 || end < 1) {
        return "Số tuần phải lớn hơn 0";
      }
    } else if (weekNumbers && weekNumbers.length === 1) {
      const week = parseInt(weekNumbers[0]);
      if (week < 1) {
        return "Số tuần phải lớn hơn 0";
      }
    }

    return null; // Hợp lệ
  };

  const validateCigarettes = (cigarettesValue) => {
    if (!cigarettesValue || cigarettesValue.trim() === "") {
      return "Vui lòng nhập số điếu thuốc";
    }

    const num = parseInt(cigarettesValue);
    if (isNaN(num)) {
      return "Số điếu thuốc phải là số";
    }

    if (num < 1) {
      return "Số điếu thuốc phải lớn hơn 0";
    }

    if (num > 50) {
      return "Số điếu thuốc không được vượt quá 50";
    }

    return null; // Hợp lệ
  };

  const validateForm = () => {
    const newErrors = {};
    let hasError = false;

    stages.forEach((stage, stageIdx) => {
      stage.weeks.forEach((week, weekIdx) => {
        const weekError = validateWeekFormat(week.week);
        const cigarettesError = validateCigarettes(week.cigarettes);

        if (weekError) {
          newErrors[`${stageIdx}-${weekIdx}-week`] = weekError;
          hasError = true;
        }

        if (cigarettesError) {
          newErrors[`${stageIdx}-${weekIdx}-cigarettes`] = cigarettesError;
          hasError = true;
        }
      });
    });

    setErrors(newErrors);
    return !hasError;
  };

  // ================ EVENT HANDLERS ================
  const handleChange = (stageIdx, rowIdx, field, value) => {
    if (mode === "view") return;

    const newStages = [...stages];
    newStages[stageIdx].weeks[rowIdx][field] = value;
    setStages(newStages);
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      message.error("Vui lòng sửa các lỗi trong form trước khi lưu!");
      return;
    }
    setModalOpen(true);
  };

  const handleAddRow = (stageIdx) => {
    if (mode === "view") return;
    const newStages = [...stages];
    newStages[stageIdx].weeks.push({ week: "", cigarettes: "" });
    setStages(newStages);
  };

  const handleAddStage = () => {
    if (mode === "view") return;
    setStages([...stages, initialStage()]);
  };

  const handleDeleteRow = (stageIdx, rowIdx) => {
    if (mode === "view") return;
    const newStages = [...stages];
    if (newStages[stageIdx].weeks.length > 1) {
      newStages[stageIdx].weeks.splice(rowIdx, 1);
      setStages(newStages);
    }
  };

  const handleDeleteStage = (stageIdx) => {
    if (mode === "view" || stages.length === 1) return;
    const newStages = [...stages];
    newStages.splice(stageIdx, 1);
    setStages(newStages);
  };

  const handleEdit = () => setMode("edit");

  // ================ API FUNCTIONS ================
  const handleModalOk = async () => {
    setLoading(true);
    try {
      // Lấy danh sách stage cũ từ server
      const res = await api.get(
        `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
      );
      const oldStages = res.data || [];

      // Xóa stage cũ không còn trong kế hoạch mới
      for (const old of oldStages) {
        let stillExist = false;
        for (const stage of stages) {
          for (const week of stage.weeks) {
            if (week.id === old.id) stillExist = true;
          }
        }
        if (!stillExist) {
          await api.delete(
            `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${old.id}`
          );
        }
      }

      // Cập nhật hoặc tạo mới từng dòng
      for (let i = 0; i < stages.length; i++) {
        for (let j = 0; j < stages[i].weeks.length; j++) {
          const week = stages[i].weeks[j];
          const data = {
            week_range: week.week,
            targetCigarettes: Number(week.cigarettes),
          };

          if (week.id) {
            // PUT cập nhật
            await api.put(
              `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages/${week.id}`,
              data
            );
          } else {
            // POST tạo mới
            await api.post(
              `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`,
              {
                ...data,
                stageNumber: i + 1,
                quitPlanId: Number(quitPlanId),
              }
            );
          }
        }
      }

      // Reload dữ liệu sau khi lưu
      await reloadPlanFromServer();

      Modal.success({ content: "Lưu kế hoạch thành công!" });
    } catch (err) {
      Modal.error({ content: "Có lỗi khi lưu kế hoạch!" });
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const handleCancelEdit = async () => {
    setLoading(true);
    try {
      await reloadPlanFromServer();
      setMode("view");
      setErrors({});
    } finally {
      setLoading(false);
    }
  };

  const reloadPlanFromServer = async () => {
    const res = await api.get(
      `/v1/customers/${accountId}/quit-plans/${quitPlanId}/stages`
    );

    if (res.data && res.data.length > 0) {
      const stageMap = {};
      res.data.forEach((item) => {
        if (!stageMap[item.stageNumber]) stageMap[item.stageNumber] = [];
        stageMap[item.stageNumber].push({
          week: item.week_range,
          cigarettes: item.targetCigarettes.toString(),
          id: item.id,
        });
      });

      setStages(
        Object.keys(stageMap)
          .sort()
          .map((k) => ({ weeks: stageMap[k] }))
      );
      setMode("view");
      localStorage.removeItem(LOCAL_KEY);
    }
  };

  // ================ EFFECTS ================
  useEffect(() => {
    async function fetchPlan() {
      if (!accountId || !quitPlanId) {
        const draft = localStorage.getItem(LOCAL_KEY);
        if (draft) setStages(JSON.parse(draft));
        return;
      }

      try {
        setLoading(true);
        await reloadPlanFromServer();
      } catch (error) {
        console.error("Error fetching plan:", error);
        const draft = localStorage.getItem(LOCAL_KEY);
        if (draft) setStages(JSON.parse(draft));
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, [accountId, quitPlanId]);

  useEffect(() => {
    if (mode === "create" || mode === "edit") {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(stages));
    }
  }, [stages, mode]);

  // ================ RENDER HELPERS ================
  const renderStageTable = (stage, stageIdx) => {
    const dataSource = stage.weeks.map((row, rowIdx) => {
      const weekErrorKey = `${stageIdx}-${rowIdx}-week`;
      const cigarettesErrorKey = `${stageIdx}-${rowIdx}-cigarettes`;

      return {
        key: rowIdx,
        week:
          mode === "view" ? (
            <div className="qc-planning-cell-view-week">{row.week}</div>
          ) : (
            <div>
              <Input
                value={row.week}
                placeholder="Ví dụ: Tuần 1 - 2, Tuần 3"
                onChange={(e) =>
                  handleChange(stageIdx, rowIdx, "week", e.target.value)
                }
                className={`qc-planning-input-week ${
                  errors[weekErrorKey] ? "error" : ""
                }`}
                status={errors[weekErrorKey] ? "error" : ""}
              />
              {errors[weekErrorKey] && (
                <div className="qc-planning-error-message">
                  {errors[weekErrorKey]}
                </div>
              )}
            </div>
          ),
        cigarettes:
          mode === "view" ? (
            <div className="qc-planning-cell-view-cigarettes">
              {row.cigarettes} điếu/ngày
            </div>
          ) : (
            <div>
              <Input
                type="number"
                min={0}
                max={100}
                value={row.cigarettes}
                placeholder="0-50 điếu/ngày"
                onChange={(e) =>
                  handleChange(stageIdx, rowIdx, "cigarettes", e.target.value)
                }
                className={`qc-planning-input-cigarettes ${
                  errors[cigarettesErrorKey] ? "error" : ""
                }`}
                status={errors[cigarettesErrorKey] ? "error" : ""}
              />
              {errors[cigarettesErrorKey] && (
                <div className="qc-planning-error-message">
                  {errors[cigarettesErrorKey]}
                </div>
              )}
            </div>
          ),
        action:
          mode !== "view" && rowIdx !== 0 ? (
            <Button
              danger
              size="small"
              onClick={() => handleDeleteRow(stageIdx, rowIdx)}
              className="qc-planning-btn-delete-row"
            >
              Xóa
            </Button>
          ) : null,
      };
    });

    const columns = [
      {
        title: "Khoảng thời gian",
        dataIndex: "week",
        key: "week",
        align: "center",
      },
      {
        title: "Số điếu mỗi ngày trong khoảng này",
        dataIndex: "cigarettes",
        key: "cigarettes",
        align: "center",
      },
      ...(mode !== "view"
        ? [
            {
              title: "",
              dataIndex: "action",
              key: "action",
              align: "center",
              width: 80,
            },
          ]
        : []),
    ];

    return (
      <Table
        className="qc-planning-stage-table"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
    );
  };

  const renderGuideCard = () => {
    if (mode === "view") return null;

    return (
      <div className="qc-planning-guide-card">
        <h3 className="qc-planning-guide-title">
          💡{" "}
          {mode === "edit"
            ? "Hướng dẫn chỉnh sửa kế hoạch:"
            : "Hướng dẫn tạo kế hoạch linh hoạt:"}
        </h3>
        <ul className="qc-planning-guide-list">
          <li>Bạn có thể tạo nhiều giai đoạn (ví dụ: Giai đoạn 1, 2, 3...)</li>
          <li>Mỗi giai đoạn có thể có nhiều khoảng thời gian khác nhau</li>
          <li>
            <strong>Định dạng khoảng thời gian hợp lệ:</strong>
          </li>
          <p style={{ marginLeft: "20px", color: "#52c41a" }}>
            ✓ "Tuần 1 - 2", "Tuần 3-5", "Tuần 1"
            <br />✓ "Tuần 1 đến 3", "Tuần 1 - Tuần 3"
          </p>
          <li>✅ Có thể thêm/xóa giai đoạn và khoảng thời gian</li>
          <li>✅ Có thể chỉnh sửa cả khoảng thời gian và số điếu thuốc</li>
          <li>✅ Số điếu/ngày phải từ 1 đến 50</li>
        </ul>
      </div>
    );
  };

  const renderControls = () => {
    switch (mode) {
      case "create":
        return (
          <>
            <Button
              type="default"
              className="qc-planning-btn-add-stage"
              onClick={handleAddStage}
            >
              Thêm giai đoạn
            </Button>
            <Button
              type="primary"
              className="qc-planning-btn-save"
              onClick={handleConfirm}
            >
              Lưu kế hoạch
            </Button>
          </>
        );
      case "view":
        return (
          <Button
            type="primary"
            className="qc-planning-btn-edit"
            onClick={handleEdit}
          >
            Chỉnh sửa
          </Button>
        );
      case "edit":
        return (
          <>
            <Button
              onClick={handleCancelEdit}
              className="qc-planning-btn-cancel"
            >
              Hủy
            </Button>
            <Button
              type="default"
              className="qc-planning-btn-add-stage"
              onClick={handleAddStage}
            >
              Thêm giai đoạn
            </Button>
            <Button
              type="primary"
              className="qc-planning-btn-save-edit"
              onClick={handleConfirm}
            >
              Lưu thay đổi
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // ================ MAIN RENDER ================
  return (
    <>
      <Navbar />

      {/* Banner */}
      <div className="qc-planning-banner-container">
        <img
          src={create1}
          alt="Banner tự lập kế hoạch"
          className="qc-planning-banner-image"
        />
      </div>

      {/* Main Content */}
      <div className="qc-planning-main-container">
        <h2 className="qc-planning-main-title">
          {mode === "view"
            ? "Kế Hoạch Cai Thuốc Của Bạn"
            : "Bảng Tự Lập Kế Hoạch"}
        </h2>

        {/* Guide Card */}
        {renderGuideCard()}

        {/* Loading */}
        {loading && <div className="qc-planning-loading">Đang tải...</div>}

        {/* Stages */}
        {!loading &&
          stages.map((stage, stageIdx) => (
            <div key={stageIdx} className="qc-planning-stage-card">
              <div className="qc-planning-stage-header">
                <span className="qc-planning-stage-title">
                  Giai đoạn {stageIdx + 1}
                </span>
                <div className="qc-planning-stage-actions">
                  {mode !== "view" && (
                    <>
                      <Button
                        type="primary"
                        onClick={() => handleAddRow(stageIdx)}
                        className="qc-planning-btn-add-row"
                        size="small"
                      >
                        Thêm khoảng thời gian
                      </Button>
                      {stages.length > 1 && (
                        <Button
                          danger
                          size="small"
                          onClick={() => handleDeleteStage(stageIdx)}
                          className="qc-planning-btn-delete-stage"
                        >
                          Xóa giai đoạn
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              {renderStageTable(stage, stageIdx)}
            </div>
          ))}

        {/* Controls */}
        <div className="qc-planning-controls">{renderControls()}</div>

        {/* Confirmation Modal */}
        <Modal
          title={
            mode === "edit" ? "Xác nhận cập nhật kế hoạch" : "Xác nhận kế hoạch"
          }
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={
            <div className="qc-planning-modal-footer">
              <Button
                onClick={() => setModalOpen(false)}
                className="qc-planning-btn-modal-cancel"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                className="qc-planning-btn-modal-confirm"
                loading={loading}
                onClick={handleModalOk}
              >
                Đồng ý
              </Button>
            </div>
          }
          className="qc-planning-modal"
        >
          <p className="qc-planning-modal-content">
            {mode === "edit"
              ? "Bạn chắc chắn muốn lưu những thay đổi này?"
              : "Bạn chắc chắn muốn xác nhận và lưu kế hoạch này?"}
          </p>
        </Modal>
      </div>

      <Footer />
    </>
  );
}

export default CreatePlanning;
