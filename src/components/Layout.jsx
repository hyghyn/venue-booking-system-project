import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link className="link" to="/">
              01 - CSS Test
            </Link>
          </li>
          <li>
            <Link className="link" to="/rooms">
              02 - Venue Booking System (Javascript Test)
            </Link>
          </li>
          <li>
            <Link className="link" to="/booking?roomId=A101">
              03 - Venue Booking System (Front-end Test){" "}
            </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
