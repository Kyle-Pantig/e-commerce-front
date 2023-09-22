import { BeatLoader } from "react-spinners";

const Spinner = ({ fullwidth }) => {
  return (
    <div
      className={`${fullwidth && " flex justify-center mt-5"}`}
      fullwidth={fullwidth}
    >
      <BeatLoader speedMultiplier={2} color="#000" />
    </div>
  );
};

export default Spinner;
