import { useEffect, useState } from "react";
import { Modal } from "./Modal";

type PlanDecisionModalProps = {
  open: boolean;
  mode: "APPROVE" | "REJECT";
  planTitle: string;
  reviewerName: string;
  submitting: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
};

// 专家审批弹窗：批准直接确认，驳回必须保留原因。
export function PlanDecisionModal({
  open,
  mode,
  planTitle,
  reviewerName,
  submitting,
  onConfirm,
  onCancel
}: PlanDecisionModalProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
      setTouched(false);
    }
  }, [open]);

  const isReject = mode === "REJECT";
  const reasonMissing = isReject && reason.trim().length === 0;

  return (
    <Modal
      open={open}
      title={isReject ? "驳回修复方案" : "批准修复方案"}
      onClose={onCancel}
      footer={
        <>
          <button type="button" className="btn" onClick={onCancel} disabled={submitting}>
            取消
          </button>
          <button
            type="button"
            className={isReject ? "btn btn-danger" : "btn btn-primary"}
            disabled={submitting || reasonMissing}
            onClick={() => onConfirm(reason.trim())}
          >
            {submitting ? "提交中…" : isReject ? "确认驳回" : "确认批准"}
          </button>
        </>
      }
    >
      <p className="modal-plan-title">方案：{planTitle}</p>
      <p className="modal-reviewer">审批人：{reviewerName}</p>
      {isReject ? (
        <label className="field">
          <span>
            驳回原因 <em>*</em>
          </span>
          <textarea
            rows={4}
            value={reason}
            placeholder="请填写驳回原因，修复师将据此修改后重新提交"
            onChange={(event) => setReason(event.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && reasonMissing ? <small className="field-error">驳回原因不能为空</small> : null}
        </label>
      ) : (
        <p className="modal-hint">批准后将记录审批人与审批时间，关联病害状态自动转为“修复中”，且方案内容锁定不可再改。</p>
      )}
    </Modal>
  );
}
