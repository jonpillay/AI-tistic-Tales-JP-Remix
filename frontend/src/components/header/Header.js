import './Header.css';
import HomeIcon from './typing-logo.png';
import Nav from '../nav/Nav'
import UserPanel from '../user-panel/UserPanel';
import { useNavigate } from 'react-router';
import { useLoadingContext } from '../../hooks/useLoadingContext';
import { useEffect, useState } from 'react';


import { resetStoryBookSlice } from "../story-book/storyBookSlice";
import { resetSysInfo, resetStorySysInfo } from "../create-stories-page/storyBookSysInfoSlice";

import { useStoryContext } from "../../hooks/useStoryContext";
import { useDispatch } from "react-redux";

import { clearReduxPersist, clearStoryBookPersist } from "../../redux-state/store";

import { store, persistor } from '../../redux-state/store';

const Header = () => {

  const { loading } = useLoadingContext()
  const navigate = useNavigate()

  const { dispatch } = useStoryContext()


  const [showHeaderMouse, setShowHeaderMouse] = useState(false)

  const reduxDispatch = useDispatch()

  useEffect(() => {
    const headerScroll = (Mpos) => {
      if (window.scrollY > 28 && Mpos.clientY < 190) {
        console.log("Header mouse fired")
        setShowHeaderMouse(true)
      } else {
        setShowHeaderMouse(false)
      }
    };

    window.addEventListener('scroll', headerScroll);
    window.addEventListener('mousemove', headerScroll);


    // const headerMouse = (Mpos) => {
    //   if (Mpos.clientY < 190) {
    //     setShowHeaderMouse(true)
    //   }
    // }

    // document.addEventListener('mousemove', headerMouse);
  }, [])

  // const goHome = () => {
  //   setTimeout(function(){
  //     reduxDispatch(resetStoryBookSlice)
  //     reduxDispatch(resetStorySysInfo)
  //     persistor.flush()
  //     localStorage.removeItem("storyPages");
  //     localStorage.removeItem("GPTPromptHistory")
  //     localStorage.removeItem("userChoices");
  //     localStorage.removeItem("sysInfo");
  //   }, 200);

  //   navigate("/");
  // };

  const endStory = async () => {
    await reduxDispatch(resetStorySysInfo())
    await reduxDispatch(resetStoryBookSlice())
    await localStorage.removeItem('storyPages')
    await localStorage.removeItem('sysInfo');
    await localStorage.removeItem('userChoices');
    await localStorage.removeItem('GPTPromptHistory');
    await localStorage.removeItem('localGPTPromptHistory');

    await dispatch({type: "END", payload: null})

    navigate("/");
  }

  return (
    <div className={showHeaderMouse ? 'header-container scroll' : 'header-container'}>
      <button className="home-button" onClick={endStory} disabled={loading}>
        <img className="home-icon" src={HomeIcon} alt="home" />
      </button>
      <div className='title-container'>
        <div className='title'>1000 Monkeys</div>
      </div>
      <Nav />
    </div>
  );
};

export default Header;
