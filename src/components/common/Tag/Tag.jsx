import "./Tag.scss";

const Tag = ({ label, dismissTag }) => {
  return (
    <div className="tag">
      <span className="tag__label">{label}</span>
      <button className="tag__button" onClick={() => dismissTag(label)}>
        X
      </button>
    </div>
  );
};

export default Tag;
