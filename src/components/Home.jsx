import { useState, useEffect } from "react";

const Home = () => {
  const [images, setImages] = useState([]);
  const API_URL = "https://picsum.photos/v2/list";

  const getAllImage = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setImages(data);
  };

  useEffect(() => {
    getAllImage();
  }, []);

  return (
    <>
      <h3>01 - CSS Test - (File : Home.jsx)</h3>
      <div className="container">
        <div className="column" id="albums">
          {images.map((image) => (
            <img key={image.id} className="img-item" src={image.download_url} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
