const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="flex gap-5 mb-2">
      {tabs.map((tabName, index) => (
        <span
          key={index}
          onClick={() => {
            onChange(tabName);
          }}
          className={`text-xl cursor-pointer ${
            active === tabName
              ? " text-black border-b-2 border-black "
              : " text-gray-500  "
          }`}
        >
          {tabName}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
