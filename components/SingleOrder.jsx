const SingleOrder = ({ line_items, createdAt, ...rest }) => {
  return (
    <div className="my-3 py-3 border-b-2 flex gap-5 items-center">
      <div>
        <time className=" text-base text-gray-500 ">
          {new Date(createdAt).toLocaleString("sv-SE")}
        </time>
        <div className="text-sm leading-4 mt-1 text-gray-700">
          {rest.name}
          <br />
          {rest.email}
          <br />
          {rest.streetBarangay} {rest.city}
          <br />
          {rest.postalCode} {rest.province} , {rest.country}
        </div>
      </div>
      <div>
        {line_items.map((item, index) => (
          <div key={index}>
            <span className="text-gray-400">{item.quantity} x </span>
            {item.price_data.product_data.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleOrder;
