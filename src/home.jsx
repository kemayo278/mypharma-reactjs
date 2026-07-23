import React from "react";
import { useNavigate } from "react-router-dom";
import logo from '@assets/imgs/logokokitechgroup.png'
import { useTranslation } from 'react-i18next';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div class="starting-page"><br /><br />
      <div class="starting-topleft">
        <img src={logo} style={{ width:"80px",height:"50px",objectFit:"contain" }} alt="" />
      </div><br /><br />
      <div class="starting-middle">
        <h1>SKYLE APP</h1><br />
        <hr /><br />
        <p>
          { t('home.description') }
        </p><br />
        <p>
        <div class="link-login" style={{ width:"70%",marginLeft:"auto", marginRight:"auto" }}>
            <button onClick={()=>{ navigate(`/home`) }} type="button" class="login">
              { t('home.btngetStarted') }
            </button>
          </div>
        </p>
      </div>
      <div style={{ height:"30px" }}></div>
      <div class="starting-bottomleft">
        {/* <p>Some text</p> */}
      </div>
    </div>
  );
}
