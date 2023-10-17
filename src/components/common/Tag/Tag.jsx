import "./Tag.scss";

const Tag = ({ label, dismissTag }) => {
  return (
    <div className="tag" onClick={() => dismissTag(label)}>
      {label}
    </div>
  );
};

export default Tag;
