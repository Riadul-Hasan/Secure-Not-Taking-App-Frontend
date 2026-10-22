import { ConfirmDialog } from './Dialogs';

const ConfirmModal = ({
  open,
  title = 'Are you sure?',
  message,
  detail,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  tone = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) => (
  <ConfirmDialog
    open={open}
    title={title}
    message={message}
    detail={detail}
    confirmLabel={confirmLabel}
    cancelLabel={cancelLabel}
    tone={tone}
    loading={loading}
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
);

export default ConfirmModal;