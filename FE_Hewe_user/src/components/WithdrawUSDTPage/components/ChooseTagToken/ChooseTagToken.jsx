import clsx from "clsx";
import "./ChooseTagToken.scss";

const TAG_ITEMS = [{ value: "BEP20" }, { value: "ERC20" }, { value: "TRC20" }];

export const ChooseTagToken = ({ currentTag, onChooseTag }) => {
  const tagItems = TAG_ITEMS.map((tag) => {
    const tagClasses = clsx("tagItem", {
      isSelected: currentTag === tag.value,
    });

    return (
      <div
        className={tagClasses}
        key={tag.value}
        onClick={onChooseTag(tag.value)}
      >
        {tag.value}
      </div>
    );
  });

  return <div className="chooseTagTokenContainer">{tagItems}</div>;
};
