const NavButton = ({ icon, onClick, classNames }) => {
  return (
    <button className={` btn-primary ${classNames} `} onClick={onClick}>
      {icon}
    </button>
  );
};

export default NavButton;
