import "./ActionSheet.scss";

const ActionSheet = ({ children, closeAction }) => {
  return (
    <div className="action-sheet__wrapper" onClick={closeAction}>
      <div className="action-sheet__container">{children}</div>
    </div>
  );
};

export default ActionSheet;
