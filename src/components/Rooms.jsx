import { useState, useEffect } from "react";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  let dataRoom = [];
  const API_URL = "./src/assets/demo-booking-data.json";

  const getAllRoom = async () => {
    const response = await fetch(API_URL);
    const roomdata = await response.json();
    setRooms(roomdata);
  };

  useEffect(() => {
    getAllRoom();
  }, []);

  const checkAvailability = (roomId, startTime, endTime) => {
    for (let room of rooms) {
      if (roomId == room.roomId) {
        let roomStartTime = new Date(room.startTime); //เวลาเริ่มต้นใช้ห้อง
        let roomEndTime = new Date(room.endTime); //เวลาสิ้นสุดใช้ห้อง
        let checkStartTime = new Date(startTime); //เวลาเริ่มต้นจองจะใช้ห้อง
        let checkEndTime = new Date(endTime); //เวลาสิ้นสุดจองจะใช้ห้อง
        if (
          (checkStartTime >= roomStartTime && checkStartTime <= roomEndTime) ||
          (checkEndTime >= roomStartTime && checkEndTime <= roomEndTime) ||
          !(checkEndTime <= roomStartTime || roomEndTime <= checkStartTime)
        ) {
          return false; // ได้ค่า false กรณีที่ช่วงเวลาไม่ซ้อนกัน
        } else {
          return true; // ได้ค่า true กรณีที่ช่วงเวลาซ้อนกัน
        }
      }
    }
  };

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
    /*let sDay = new Date("2019-09-28");
    let eDay = new Date("2019-09-28");*/

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
    //console.log(checkStartTime);
    //console.log(checkEndTime);

    for (let room of rooms) {
      let roomStartTime = new Date(room.startTime.split(" ")[0]); //เวลาเริ่มต้นใช้ห้อง
      let roomEndTime = new Date(room.endTime.split(" ")[0]); //เวลาสิ้นสุดใช้ห้อง

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
    return dataRoom;
  };

  return (
    <>
      <h3>02 - Venue Booking System (Javascript Test) - (File : Rooms.jsx)</h3>
      <p className="warning">
        {
          "Function checkAvailability( 'Auditorium', '2023-08-17 12:30:00', '2023-08-20 13:30:00' ) = "
        }
        {String(
          checkAvailability(
            "Auditorium",
            "2023-08-17 12:30:00",
            "2023-08-20 13:30:00"
          )
        )}
      </p>
      <p className="warning">
        {
          "Function checkAvailability( 'A102', '2023-08-28 12:30:00', '2023-08-28 13:30:00' ) = "
        }
        {String(
          checkAvailability(
            "A102",
            "2023-08-28 12:30:00",
            "2023-08-28 13:30:00"
          )
        )}
      </p>
      <table>
        <thead>
          <tr>
            <th>ROOM ID</th>
            <th>TITLE</th>
            <th>START TIME</th>
            <th>END TIME</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.roomId}</td>
              <td>{room.title}</td>
              <td>{room.startTime}</td>
              <td>{room.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <p className="warning left">
        {"weekNo = 1:สัปดาห์นี้ | 2:สัปดาห์หน้า | 3:เดือนนี้"}
      </p>
      <p className="warning left">
        {"Function getBookingsForWeek('A101',1) : "}
      </p>
      <table>
        <thead>
          <tr>
            <th>ROOM ID</th>
            <th>TITLE</th>
            <th>START TIME</th>
            <th>END TIME</th>
          </tr>
        </thead>
        <tbody>
          {getBookingsForWeek("A101", 1).map((book) => (
            <tr key={book.id}>
              <td>{book.roomId}</td>
              <td>{book.title}</td>
              <td>{book.startTime}</td>
              <td>{book.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Rooms;
