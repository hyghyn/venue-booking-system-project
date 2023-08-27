import { useState, useEffect } from "react";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  let dataRoom = [];
  let gRoom = {};
  const API_URL = "./src/assets/demo-booking-data.json";

  let roomNo = document.URL.split("=")[1]; //ค่า roomId

  //let toDay = new Date("2019-09-28"); //สมมติค่าวันนี้เป็น 2019-09-28 เพื่อทดสอบจากข้อมูลตัวอย่าง
  let toDay = new Date();
  const getDayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const getMonthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const getTime = (sDate, eDate) => {
    let [sH, sM, sS] = sDate.split(" ")[1].split(":");
    let [eH, eM, eS] = eDate.split(" ")[1].split(":");
    return `${sH}:${sM} - ${eH}:${eM}`;
  };
  const getAllRoom = async () => {
    const response = await fetch(API_URL);
    const roomdata = await response.json();
    setRooms(roomdata);
  };

  useEffect(() => {
    getAllRoom();
  }, []);

  const getBookingsForWeek = (roomId, weekNo = null) => {
    dataRoom = []; //reset dataRoom

    let checkStartTime; //เวลาเริ่มต้นจองจะใช้ห้อง
    let checkEndTime; //เวลาสิ้นสุดจองจะใช้ห้อง
    let lastDayOfMonth; //วันสุดท้ายของเดือน

    //ทำให้เวลาของวันนี้เริ่ม 07:00:00 เสมอ
    let now = new Date();
    let sDay = new Date(
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    );
    let eDay = new Date(
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    );

    //สมมติค่าวันนี้เป็น 2019-09-28 เพื่อทดสอบจากข้อมูลตัวอย่าง
    /*let sDay = new Date("2023-08-27");
    let eDay = new Date("2023-08-27");*/

    checkStartTime = sDay;
    checkEndTime = eDay;

    switch (weekNo) {
      case 1 /*สัปดาห์นี้*/:
        //วันอาทิตย์ คือ ต้นสัปดาห์
        checkStartTime.setDate(
          checkStartTime.getDate() - checkStartTime.getDay()
        );
        //วันเสาร์ คือ ปลายสัปดาห์
        checkEndTime.setDate(
          checkEndTime.getDate() + (6 - checkEndTime.getDay())
        );
        break;
      case 2 /*สัปดาห์หน้า*/:
        //วันอาทิตย์ คือ ต้นสัปดาห์
        checkStartTime.setDate(
          7 + checkStartTime.getDate() - +checkStartTime.getDay()
        );
        //วันเสาร์ คือ ปลายสัปดาห์
        checkEndTime.setDate(
          7 + checkEndTime.getDate() + (6 - checkEndTime.getDay())
        );
        break;
      case 3 /*ทั้งเดือน*/:
        lastDayOfMonth = new Date(sDay.getFullYear(), sDay.getMonth() + 1, 0); //หาค่าวันสุดท้ายของเดือน
        checkStartTime = new Date(
          `${sDay.getFullYear()}-${sDay.getMonth() + 1}-1`
        );
        checkEndTime = new Date(
          `${eDay.getFullYear()}-${
            eDay.getMonth() + 1
          }-${lastDayOfMonth.getDate()}`
        );
        break;
    }
    // console.log(checkStartTime);
    // console.log(checkEndTime);

    for (let room of rooms) {
      let roomStartTime = new Date(room.startTime.split(" ")[0]); //เวลาเริ่มต้นใช้ห้อง
      let roomEndTime = new Date(room.endTime.split(" ")[0]); //เวลาสิ้นสุดใช้ห้อง
      // console.log(roomStartTime);
      // console.log(roomEndTime);
      if (roomId == room.roomId) {
        if (
          (checkStartTime >= roomStartTime && checkStartTime <= roomEndTime) ||
          (checkEndTime >= roomStartTime && checkEndTime <= roomEndTime) ||
          !(checkEndTime <= roomStartTime || roomEndTime <= checkStartTime)
        ) {
          dataRoom.push(room);
        }
      }
    }
    //console.log(dataRoom);
    if (weekNo != null) {
      //console.log(dataRoom);
      groupRoom(dataRoom);
    }
    return dataRoom;
  };

  const groupRoom = (rooms) => {
    gRoom = {};
    for (let i in rooms) {
      let nameG = rooms[i].startTime.split(" ")[0];
      if (!gRoom[nameG]) {
        gRoom[nameG] = [];
      }
      gRoom[nameG].push({
        id: rooms[i].id,
        roomId: rooms[i].roomId,
        startTime: rooms[i].startTime,
        endTime: rooms[i].endTime,
        title: rooms[i].title,
      });
    }
  };

  return (
    <>
      <h3>03 - Venue Booking System (Front-end Test) - (File : Booking.jsx)</h3>
      <main>
        <div className="left-box">
          <h4>{roomNo}</h4>
          <div className="detail-now">
            <p className="show-popup">Upcoming</p>
            <p className="show-day">{getDayName[toDay.getDay()]}</p>
            <p className="show-date">{`${toDay.getDate()} ${
              getMonthName[toDay.getMonth()]
            }`}</p>
          </div>
          <div className="list-room-now">
            {getBookingsForWeek(roomNo).map((book) => (
              <div className="a-room" key={book.id}>
                <p className="times">{getTime(book.startTime, book.endTime)}</p>
                <p className="title-room">{book.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="right-box">
          <div className="tabs">
            <button className="tablink">
              THIS WEEK<span></span>
            </button>
            <button className="tablink">
              NEXT WEEK<span></span>
            </button>
            <button className="tablink">
              WHOLE MONTH<span></span>
            </button>
          </div>
          <div className="detail-contain">
            <div className="header-name">Today (Mon, 28 Sep)</div>
            <ul>
              <li>
                <p className="times">13:00-14:00</p>
                <p className="title-room">Lunch with Petr</p>
              </li>
              <li>
                <p className="times">14:00-15:00</p>
                <p className="title-room">Sales Weekly Meeting</p>
              </li>
              <li>
                <p className="times">16:00-18:00</p>
                <p className="title-room">Anastasia Website Warroom</p>
              </li>
            </ul>
            <div className="header-name">Tomorrow (Tue, 29 Sep)</div>
            <ul>
              <li>
                <p className="times">13:00-14:00</p>
                <p className="title-room">One-on-one Session</p>
              </li>
              <li>
                <p className="times">16:00-18:00</p>
                <p className="title-room">UGC Sprint Planning</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default Booking;
