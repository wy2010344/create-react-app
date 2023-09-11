import { AnimatePresence, motion } from "framer-motion";
import { Link, Outlet, Route, RouterProvider, Routes, createBrowserRouter, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import styled from "styled-components";

const router = createBrowserRouter([
  {
    path: '/',
    index: true,
    element: <Cars />
  },
  {
    path: ':id',
    element: <Car />
  }
])

const logo = require('./images/logos/logocoloured.png')
function Navigation() {
  return (
    <NavigationBar className="navigationBar">
      <div className="logo">
        <img
          className="logoImage"
          src={logo}
          alt=""
        />
      </div>
      <div className="dropdownMenu">
        <div className="dropdownIcon">
          {/* <div className="bar first"></div> */}
          <div className="bar  second"></div>
          <div className="bar third"></div>
        </div>
      </div>
    </NavigationBar>
  );
};

const NavigationBar = styled.div`
  
  display: flex;
  justify-content: space-between;
  height: 100px;
  align-items: center;
  >.logo{
    >.logoImage{
  width: 50px;
  margin: 15px 30px;
    }
  }
  >.dropdownMenu{
    >.dropdownIcon{
      
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 35px;
  height: 12px;
  margin: 0 30px;
  >.bar{

  background-color: gray;
  height: 3px;
  width: 100%;
  }
  >.third{

  width: 60%;
  margin-left: 40%;
  }
    }
  }
`

/**
 * 这里不适合图片过度动画
 * 因为grid卡片进入时有跳动动画,而返回上一页也会出现,不是层叠的
 * @returns 
 */
export default function index() {
  return (
    <Wrapper className="w-full h-full bg-white ">
      <Navigation />
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
    </Wrapper>
  )
}
const Wrapper = styled.div`
color: black;
background-color: white;
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
`
export const gridAnimation = {
  show: {
    transition: {
      staggerChildren: 0.1,
      // staggerDirection: -1
    }
  },
  hide: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  },
};
export const cardAnimation = {
  show: { y: [200, 0], opacity: [0, 1], scale: [0.95, 1] },
  hide: { y: [0, 200], opacity: [1, 0], scale: [1, 0.95] },
};
export const h3Animation = {
  show: { y: [-100, 0], opacity: [0, 1], scale: [0.9, 1] },
  hide: { y: [0, -100], opacity: [1, 0], scale: [1, 0.9] },
};
export const carAnimation = {
  show: { width: ["200vw", "100vw"], opacity: [0, 1] },
  hide: { width: ["100vw", "200vw"], opacity: [1, 0] },
};


function Cars() {
  return <CarsContainer className="carsContainer">
    <motion.h3 variants={h3Animation} animate="show" exit="hide">
      choose your car
    </motion.h3>
    <motion.div
      className="cars"
      variants={gridAnimation}
      animate="show"
      exit="hide"
    >
      {Data.map((item) => {
        return (
          <Link to={`/${item.id}`} key={item.id}>
            <motion.div className="card" variants={cardAnimation}>
              <motion.img src={
                item.image
              } alt="image" />
            </motion.div>
          </Link>
        );
      })}
    </motion.div>
  </CarsContainer>
}

const CarsContainer = styled.div`
min-height: 100vh;
text-align: center;
margin-top: 1px;
display: block;
>h3 {
  font-family: "Archivo", sans-serif;
  font-size: 25px;
  color: gray;
  opacity: 0;
}
>.cars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  padding: 10px 120px;
  >a{
    >.card {
      background: rgb(238, 238, 238);
      height: 200px;
      align-items: center;
      text-align: center;
      opacity: 0;
        padding-top: 10%;
      >img {
        width: 90%;
        max-height: 75%;
      }
    }
  }
}
`


function Car() {
  const { id } = useParams<{ id: string }>();
  const history = useNavigate();
  const singlecar = Data.find((item) => item.id === parseInt(id || '0'));
  if (!singlecar) {
    return <div>not found for {id}</div>
  }
  return (
    <CarContainer className="carcontainer">
      <motion.div
        className="car"
        variants={carAnimation}
        animate="show"
        exit="hide"
      >
        <div className="navigateBack" onClick={() => history(-1)}>
          <MdKeyboardBackspace />
        </div>
        <div className="imageAndText">
          <motion.img src={singlecar.image} alt="image" />
          <div className="carText">
            <h3>{singlecar.car}</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
              delectus ea dolore suscipit. Facilis harum dolorem, pariatur ipsa
              in adipisci!
            </p>
          </div>
        </div>
      </motion.div>
    </CarContainer>
  );
};


const CarContainer = styled.div`
  overflow: hidden;
  margin-top: -100px;
  min-height: 120vh;
  >.car{
    padding-top: 100px;
    min-height: 120vh;
    background: linear-gradient(to right, #fff 65%, tomato 30%);
    opacity: 0;
    
    >.navigateBack {
      font-size: 50px;
      color: tomato;
      cursor: pointer;
      margin-left: 30px;
      width: 0;
    }
    >.imageAndText {
      display: flex;
      margin-top: -10px;
      justify-content: space-between;
      > img {
        width: 60vw;
        margin-left: 15%;
      }
      >.carText {
        margin-right: 40px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        >h3{
          font-size: 30px;
          letter-spacing: 5px;
          color: #fff;
          margin-bottom: 40px;
          width: 300px;
        }
        > p {
          color: #fff;
          width: 300px;
          line-height: 20px;
          font-family: "Archivo", sans-serif;
        }
      }
    }
}
`

interface Row {
  id: number
  car: string
  image: string
}
const Data: Row[] = [
  {
    id: 1,
    car: "audi ",
    image: "audi .png",
  },
  {
    id: 2,
    car: "audi",
    image: "audi.png",
  },
  {
    id: 3,
    car: "bmw x5",
    image: "bmw x5.png",
  },
  {
    id: 4,
    car: "mercedes",
    image: "mercedes.png",
  },
  {
    id: 5,
    car: "bmw",
    image: "bmw.png",
  },
  {
    id: 6,
    car: "volkswagen scirocco",
    image: "volkswagen scirocco.png",
  },
].map(v => {
  return {
    ...v,
    image: require(`./images/products/${v.image}`)
  }
});
console.log(Data)
